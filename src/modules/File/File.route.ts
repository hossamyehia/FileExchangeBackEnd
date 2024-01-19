import { NextFunction, Request, Response, Router } from "express";
import FileController from "./File.controller";

const FileAPI = Router();

//  Get All Roles
FileAPI.route("/")
.get( FileController.getFiles);

FileAPI.route("/add")
.post( FileController.uploudFile, FileController.validate, FileController.addFile);

// 
FileAPI.route("/sharedwith")
.get( FileController.getSharedWith);

//  Download File
FileAPI.route("/download/:id")
.get( FileController.downloadFile );

// By Directory
FileAPI.route("/directory/:id")
.get( FileController.getFilesByDirectory);

// By Directory
FileAPI.route("/owner/:id")
.get( FileController.getFilesByOwner);

// SharedWith
FileAPI.route("/seenby/:id")
.get( FileController.getSeenBy);


//  Get, Update, Delete Specific File
FileAPI.route("/:id")
.get( FileController.getById )
.delete( FileController.removeFile );



export default FileAPI;