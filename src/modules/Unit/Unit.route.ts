import { Router } from "express";
import UnitController from "./Unit.controller";

const UnitAPI = Router();

//  Get All Roles
UnitAPI.route("/")
.get( UnitController.getUnits);

UnitAPI.route("/add")
.post( UnitController.validate, UnitController.addUnit);

UnitAPI.route("/type/:type")
.get( UnitController.getUnitsByType);

UnitAPI.route("/master")
.get( UnitController.getMaster);

UnitAPI.route("/slaves")
.get( UnitController.getSlaves);

UnitAPI.route("/relatives")
.get( UnitController.getRelatives);

//  Get, Update, Delete Specific Role
UnitAPI.route("/:id")
.get( UnitController.getById )
.put( UnitController.filterBody, UnitController.editUnit )
.delete( UnitController.removeUnit );

export default UnitAPI;