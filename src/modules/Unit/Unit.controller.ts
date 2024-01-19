import { NextFunction, Request, Response } from "express";
import {
  find,
  insertOne,
  findById,
  deleteUnit,
  updateUnit,
  findByUnitType,
  findMaster,
  findSlaves,
  findRelatives,
} from "./Unit.service";
import {
  centralizedErrMsgs,
  filterObject,
  handleResponse,
  validateKeys,
} from "../../shared/utils";
import HttpException from "../../shared/models/HttpException.model";

import {
  insertOne as insertDir,
  findById as findDir,
  findByName,
  updateDirectory,
} from "../Directory/Directory.service";

import fs from "fs";

/**
 * Add Unit
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export async function addUnit(req: Request, res: Response, next: NextFunction) {
  try {
    //let dirName = crypto.randomBytes(5).toString("hex");

    fs.mkdirSync(`./uploads/${req.body.name}`, { recursive: true });

    await insertDir(
      req.body.name,
      `/uploads/${req.body.name}/`,
      0,
      "B",
      0,
      req.user?.id as number
    );
    let dir = await findByName(req.body.name);

    if (dir)
      await insertOne(
        req.body.name,
        (dir as { [id: string]: number }).id,
        req.body.master,
        req.body.master_id
      );

    handleResponse(res, 201, true, "Added Successfully");
  } catch (err: Error | any) {
    next(new HttpException(...errMessage(err)));
  }
}

/**
 * Get All Unit
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getUnits(req: Request, res: Response, next: NextFunction) {
  find()
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get All Unit
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getUnitsByType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  findByUnitType(req.user?.unit_id as number, parseInt(req.params.type))
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get By Master
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getMaster(req: Request, res: Response, next: NextFunction) {
  findMaster(req.user?.unit_id as number)
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get Slaves
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getSlaves(req: Request, res: Response, next: NextFunction) {
  findSlaves(req.user?.unit_id as number)
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get Relatives
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getRelatives(req: Request, res: Response, next: NextFunction) {
  findRelatives(req.user?.unit_id as number)
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get Unit By Id
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getById(req: Request, res: Response, next: NextFunction) {
  findById(parseInt(req.params.id))
    .then((result: any) => {
      if (!result) return next(new HttpException(404, "Unit Not Found"));
      handleResponse(res, 200, true, "Retrieved Successfully", [result]);
    })
    .catch((err) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Edit Unit
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export async function editUnit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let unit = await findById(parseInt(req.params.id));
    if (!unit) return next(new HttpException(404, "Unit Not Found"));

    let dir = await findDir((unit as { [dir_id: string]: number }).dir_id);

    fs.renameSync(
      `.${(dir as { [path: string]: string }).path}`,
      `./uploads/${req.body.name}`
    );

    await updateDirectory((unit as { [dir_id: string]: number }).dir_id, {
      name: req.body.name,
      path: `/uploads/${req.body.name}/`,
    });
    await updateUnit(parseInt(req.params.id), req.body);

    handleResponse(res, 200, true, "Updated Successfully");
  } catch (err) {
    next(new HttpException(...errMessage(err)));
  }
}

/**
 * Remove Unit
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function removeUnit(req: Request, res: Response, next: NextFunction) {
  deleteUnit(parseInt(req.params.id))
    .then((result) => {
      if (!result) return next(new HttpException(404, "Unit Not Found"));
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
  if (!validateKeys(req.body, ["name", "master", "master_id"]))
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
  filterObject(req.body, ["name", "master", "master_id"]).then((body: any) => {
    if (!Object.keys(body).length)
      return next(new HttpException(400, "There is no Data To Update"));
    req.body = body;
    next();
  });
}

const errMessage = centralizedErrMsgs("Unit");

export default {
  addUnit,
  editUnit,
  removeUnit,
  getUnits,
  getUnitsByType,
  getById,
  getMaster,
  getSlaves,
  getRelatives,
  validate,
  filterBody,
};
