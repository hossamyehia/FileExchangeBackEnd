import { Router } from "express";

import roleController from "./role.controller";
import routePermission from "../../shared/middleware/permission.middleware";

const roleAPI = Router();

//  Get All Roles
roleAPI.route("/")
.get( roleController.getRoles);

roleAPI.route("/add")
.post( roleController.validate, roleController.addRole);

//  Get, Update, Delete Specific Role
roleAPI.route("/:tag")
.get( roleController.getByTag )
.put( roleController.filterBody, roleController.editRole )
.delete( roleController.removeRole );

export default roleAPI;