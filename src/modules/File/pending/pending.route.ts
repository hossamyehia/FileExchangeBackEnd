import { NextFunction, Request, Response, Router } from "express";
import FileController from "../File.controller";

const PendingAPI: Router = Router();

// For Unit
PendingAPI.route("/")
.get( FileController.getPendingForUnit);

PendingAPI.route("/add")
.post( FileController.addToPending);

//  Action
PendingAPI.route("/:id")
.put( FileController.acceptFile )
.delete( FileController.refuseFile );

export default PendingAPI;