import { Request, NextFunction, Response } from "express";
import ApiResponse from "../../core/models/apiResponse.model";
import HttpException from "../models/HttpException.model";
import Logger from "../../core/Service/logger/Logger";

/**
 *
 * @param res
 * @param status
 * @param success
 * @param message
 * @param data
 */
export function handleResponse(
  res: Response,
  status: number = 200,
  success: boolean,
  message: string,
  data?: Array<object>
) {
  "use strict";
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(status).json(
    Response({
      success,
      message,
      data,
    })
  );
}

const Response = (payload = {}) => {
  return new ApiResponse(payload);
};

export function centralizedErrMsgs(...info: any){
  let Name = info[0] || null;

  return function errMessage(err: any): [number, string]{
    Logger(err);
    if(err.errno == 1062) return [409, `${Name} already Exist`]
    else if(err.errno === 1451) return [409, `لا يمكن حذف العنصر لارتباطه بعنصر أخر`]
    else if(err.errno === 1452) return [409, `${err.sqlMessage.split("REFERENCES")[1].split("`")[1].toUpperCase()} Not Found`]
    else if(err.errno === 1406){
      let msg = err.sqlMessage.split("column");
      return [409, `${msg[0] + msg[1].split("'")[1]}`]
    }
    else return [500, "Server Error"];
  }
}

export function errorHandler(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): any {
  handleResponse(res, error.status, false, (error.message), []);
}

export function camelize(str: string) {
  return str.replace(/\W+(.)/g, function (match, chr) {
    return " " + chr.toUpperCase();
  });
}

export function groupBy(xs: any[], key: string | number) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export function validateKeys(obj: any, keys: string[]) {
  for (let key of keys) {
    if (!(key in obj)) return false;
  }
  return true;
}

export function filterObject(obj: any, keys: string[]) {
  return new Promise((resolve, reject) => {
    resolve(
      Object.keys(obj)
        .filter((key) => keys.includes(key))
        .reduce((cur, key) => {
          return Object.assign(cur, { [key]: obj[key] });
        }, {})
    );
  });
}

export function processSize(size: number): [number, string]{
  let sizeUnit: string = "B";
  if(size >= (1024 * 1024 * 1024)){
    size /= (1024 * 1024 * 1024);
    sizeUnit = "GB";
  }else if ( size >= (1024 * 1024) ){
    size /= (1024 * 1024);
    sizeUnit = "MB";
  }else if ( size >= 1024 ){
    size /= 1024;
    sizeUnit = "KB";
  }

  return [size, sizeUnit];
}

export function processFile(originalname: string): [string, string]{
  let m = originalname.match(/([^:\\/]*?)(?:\.([^ :\\/.]*))?$/);
  return [(m === null ? "" : m[1]), (m === null ? "" : m[2])]
}