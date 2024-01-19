import { Router } from "express";
import DirectoryController from "./Directory.controller";

const DirectoryAPI = Router();

//  Get All Directories
DirectoryAPI.route("/")
.get( DirectoryController.getDirectories);

DirectoryAPI.route("/add")
.post( DirectoryController.validate, DirectoryController.addDirectory);

DirectoryAPI.route("parent/:id")
.post( DirectoryController.validate, DirectoryController.getDirectoriesByParent);

//  Get, Update, Delete Specific Role
DirectoryAPI.route("/:id")
.get( DirectoryController.getById )
.put( DirectoryController.filterBody, DirectoryController.editDirectory )
.delete( DirectoryController.removeDirectory );

export default DirectoryAPI;