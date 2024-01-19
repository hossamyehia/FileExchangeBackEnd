import { NextFunction, Request, Response } from "express";
import {
  find,
  insertOne,
  findById,
  deleteDirectory,
  updateDirectory,
  findByParent,
} from "./Directory.service";
import {
  centralizedErrMsgs,
  filterObject,
  handleResponse,
  validateKeys,
} from "../../shared/utils";
import HttpException from "../../shared/models/HttpException.model";

/**
 * Add Directory
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function addDirectory(req: Request, res: Response, next: NextFunction) {
  let path = "";

  insertOne(req.body.name, path, 0, "B", req.body.parent, req.user?.id as number)
    .then((done: any) => {
      handleResponse(res, 201, true, "Added Successfully");
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get All Directory
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getDirectories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  find()
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get All Directory
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getDirectoriesByParent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  findByParent(parseInt(req.params.id))
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get Directory By Id
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getById(req: Request, res: Response, next: NextFunction) {
  findById(parseInt(req.params.id))
    .then((result: any) => {
      if (!result) return next(new HttpException(404, "Directory Not Found"));
      handleResponse(res, 200, true, "Retrieved Successfully", [result]);
    })
    .catch((err) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Edit Directory
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function editDirectory(req: Request, res: Response, next: NextFunction) {
  updateDirectory(parseInt(req.params.id), req.body)
    .then((result) => {
      if (!result) return next(new HttpException(404, "Directory Not Found"));
      handleResponse(res, 200, true, "Updated Successfully");
    })
    .catch((err) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Remove Directory
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function removeDirectory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  deleteDirectory(parseInt(req.params.id))
    .then((result) => {
      if (!result) return next(new HttpException(404, "Directory Not Found"));
      handleResponse(res, 200, true, "Deleted Successfully");
    })
    .catch((err) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Validate All Input Existant
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function validate(req: Request, res: Response, next: NextFunction) {
  if (!validateKeys(req.body, ["name", "parent"]))
    next(new HttpException(422, "Please Fill All Inputs"));
  next();
}

/**
 * Filter Body
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function filterBody(req: Request, res: Response, next: NextFunction) {
  filterObject(req.body, ["name", "parent", "size", "sizeUnit", "path"]).then((body: any) => {
    if (!Object.keys(body).length)
      return next(new HttpException(400, "There is no Data To Update"));
    req.body = body;
    next();
  });
}

const errMessage = centralizedErrMsgs("Directory");

export default {
  addDirectory,
  editDirectory,
  removeDirectory,
  getDirectories,
  getDirectoriesByParent,
  getById,
  validate,
  filterBody,
};
