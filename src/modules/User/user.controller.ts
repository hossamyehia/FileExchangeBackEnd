import { NextFunction, Request, Response } from "express";
import { deleteUser, find, insertUser, updateUser } from "./user.service";
import { centralizedErrMsgs, filterObject, handleResponse, validateKeys } from "../../shared/utils";
import HttpException from "../../shared/models/HttpException.model";
import { getToken } from "../../shared/service/auth.service";
import passport from "../../core/config/passport.config";

/**
 * Register New User
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function register(req: Request, res: Response, next: NextFunction) {
  insertUser(req.body.name, req.body.username, req.body.password, req.body.role, req.body.unit_id)
    .then((user) => {
      passport.authenticate("local")(req, res, () => {
        handleResponse(res, 201, true, "Register Successfully");
      });
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Login Controller
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function login(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    "local",
    (err: any, user: Express.User, info: { message: string }) => {
      if (err) return next(new HttpException(...errMessage(err)));
      if (!user) {
        if (info.message === "User Not Found.")
          return next(new HttpException(404, "User Not Found"));
        else return next(new HttpException(404, "Incorrect Password."));
      }

      let token = getToken(user);

      req.login(user, function (err) {
        if (err) {
          return next(new HttpException(...errMessage(err)));
        }
        handleResponse(res, 200, true, "Login Successfully", [{ token }]);
      });
    }
  )(req, res, next);
}

/**
 * Logout Controller
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function logout(req: Request, res: Response, next: NextFunction) {
  req.session.destroy(() =>
    handleResponse(res, 200, true, "Logout Successfully")
  );
}

/**
 * Get Registed Users
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getUsers(req: Request, res: Response, next: NextFunction) {
  find()
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Edit User
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function editUser(req: Request, res: Response, next: NextFunction) {
  updateUser(
    parseInt(req.params.id),
    req.body as { name?: string; username?: string }
  )
    .then((result) => {
      if (!result) return next(new HttpException(404, "User Not Found"));
      handleResponse(res, 200, true, "Updated Successfully");
    })
    .catch((err) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Remove User
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function removeUser(req: Request, res: Response, next: NextFunction) {
  deleteUser(parseInt(req.params.id))
    .then((result) => {
      if (!result) return next(new HttpException(404, "User Not Found"));
      handleResponse(res, 200, true, "Deleted Successfully");
    })
    .catch((err) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Validate If Inputs Exists 
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function validate(req: Request, res: Response, next: NextFunction) {
  if (!validateKeys(req.body, ["name", "username", "password",  "role"]))
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
  filterObject(req.body, ["name", "username", "password",  "role", "unit_id"]).then((body: any)=>{
    if(!Object.keys(body).length) next(new HttpException(400, "There is no Data To Update"));
    req.body = body;
    next();
  });
}

const errMessage = centralizedErrMsgs("User");

export default {
  register,
  validate,
  login,
  logout,
  getUsers,
  editUser,
  removeUser,
};
