import { Request, Response, NextFunction } from "express";
import passport from "../../core/config/passport.config";
import HttpException from "../models/HttpException.model";

/**
 * Check If User is not logged in
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function loginRequired(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err:any, user:any, info:any ) => {
        if (!user) return next(new HttpException(401, "Please log in"));
        req.user = user;
        return next();
    })(req, res, next);
}

/**
 * Check If User is already Logged in
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function loginRedirect(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err:any, user: any, info:any) => {
        if (user) return next(new HttpException(400, "logged in already"));
        return next();
    })(req, res, next);
}