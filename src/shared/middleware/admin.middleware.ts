import { Request, Response, NextFunction } from "express";
import HttpException from "../models/HttpException.model";

/*
Admin Must BE in Administration Unit

*/

const ADMINISTRATION_UNIT_ID = 0;

/**
 * Middleware to Filter Requests By Admin Privilage
 * @param req
 * @param res
 * @param next
 */
export default function routeAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const unit_id = req.user?.unit_id || "";
  if (unit_id == null) return next(new HttpException(401, "Please, login"));

  if (unit_id == ADMINISTRATION_UNIT_ID) return next();
  next(new HttpException(403, "YOU ARE NOT ALLWOED TO USE THIS API"));
}
