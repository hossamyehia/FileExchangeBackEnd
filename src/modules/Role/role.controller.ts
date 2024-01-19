import { NextFunction, Request, Response } from "express";
import {
  find,
  insertRole,
  deleteRole,
  updateRole,
  findByTag,
} from "./role.service";
import { centralizedErrMsgs, filterObject, handleResponse, validateKeys } from "../../shared/utils";
import HttpException from "../../shared/models/HttpException.model";

/**
 * Add New Role
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function addRole(req: Request, res: Response, next: NextFunction) {
  insertRole(req.body.tag, req.body.title, req.body.permission)
    .then((done: any) => {
      handleResponse(res, 201, true, "Added Successfully");
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get All Roles
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getRoles(req: Request, res: Response, next: NextFunction) {
  find()
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get Role By Role Tag
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getByTag(req: Request, res: Response, next: NextFunction) {
  findByTag(req.params.tag)
    .then((result: any) => {
      if (!result) return next(new HttpException(404, "Role Not Found"));
      handleResponse(res, 200, true, "Retrieved Successfully", [result]);
    })
    .catch((err) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Edit Role
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function editRole(req: Request, res: Response, next: NextFunction) {
  updateRole(
    req.params.tag,
    req.body as { title?: string; permission?: string }
  )
    .then((result) => {
      if (!result) return next(new HttpException(404, "Role Not Found"));
      handleResponse(res, 200, true, "Updated Successfully");
    })
    .catch((err) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Remove Role
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function removeRole(req: Request, res: Response, next: NextFunction) {
  deleteRole(req.params.tag)
    .then((result) => {
      if (!result) return next(new HttpException(404, "Role Not Found"));
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
  if (!validateKeys(req.body, ["tag", "title", "permission"]))
    return next(new HttpException(422, "Please Fill All Inputs"));
  next();
}

/**
 * Filter Body
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function filterBody(req: Request, res: Response, next: NextFunction){
  filterObject(req.body, ["tag", "title", "permission"]).then((body: any)=>{
    if(!Object.keys(body).length) next(new HttpException(400, "There is no Data To Update"));
    req.body = body;
    next();
  });
}

const errMessage = centralizedErrMsgs("Role");

export default {
  addRole,
  editRole,
  removeRole,
  getRoles,
  getByTag,
  validate,
  filterBody
};
