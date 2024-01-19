import { NextFunction, Request, Response } from "express";
import {
  find,
  insertOne,
  setPending,
  findById,
  deleteFile,
  findByDirectory,
  findByOwner,
  findPendingForUnit,
  moveToShared,
  findUnitsSharedWith,
  findSharedWith,
  deleteFromPending,
} from "./File.service";
import {
  centralizedErrMsgs,
  filterObject,
  handleResponse,
  processFile,
  processSize,
  validateKeys,
} from "../../shared/utils";
import HttpException from "../../shared/models/HttpException.model";

import uploadFile from "../../core/middleware/fileUplouder.middleware";
import {
  updateDirectory,
  findById as findPath,
} from "../Directory/Directory.service";

import fs from "fs";
import Directory from "../Directory/Directory.model";
import path from "path";
import File from "./File.model";
import { request } from "https";

/**
 * Upload File
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export async function uploudFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return next(
        new HttpException(
          ...([400, "Upload a file please!"] as [number, string])
        )
      );
    }
    /*
    console.log(console.log(req.user?.dir_id))
    if(req.user?.dir_id !== 0) fs.rename(`./uploads/${request}`)
    */
    next();
  } catch (err) {
    next(new HttpException(...errMessage(err)));
  }
}

/**
 * Add File
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export async function addFile(req: Request, res: Response, next: NextFunction) {
  let size = req.file?.size || 0;
  let sizeUnit = "B";
  [size, sizeUnit] = processSize(size);

  //let originalname = req.file?.originalname || "";
  let [fileName, fileExt] = processFile(req.body.name);

  let path = req.file?.path as string;

  let dir = (await findPath(req.body.directory)) as Directory;
  if (dir == undefined) {
    fs.rmSync(path);
    return next(
      new HttpException(...([404, "Directory Not Found"] as [number, string]))
    );
  }

  updateDirectory(req.body.directory, { size: size + dir.size });

  path = dir.path + req.file?.filename;

  insertOne(
    fileName,
    path,
    size,
    sizeUnit,
    fileExt.toLowerCase(),
    req.body.directory,
    req.user?.id as number
  )
    .then((id: any) => {
      handleResponse(res, 201, true, "Added Successfully", [{ id: id[0] }]);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get All File
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getFiles(req: Request, res: Response, next: NextFunction) {
  find()
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get All File
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getFilesByDirectory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  findByDirectory(parseInt(req.params.id))
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get All File
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getFilesByOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  findByOwner(req.user?.id as number)
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get File By Id
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getById(req: Request, res: Response, next: NextFunction) {
  findById(parseInt(req.params.id))
    .then((result: any) => {
      if (!result) return next(new HttpException(404, "File Not Found"));
      handleResponse(res, 200, true, "Retrieved Successfully", [result]);
    })
    .catch((err) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Download File By Id
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function downloadFile(req: Request, res: Response, next: NextFunction) {
  findById(parseInt(req.params.id))
    .then((result: any) => {
      if (!result) return next(new HttpException(404, "File Not Found"));
      res.download(
        path.join("./", result.path),
        `${result.name}.${result.type}`,
        (err) => {
          if (err) {
            next(new HttpException(...errMessage(err)));
          }
        }
      );
    })
    .catch((err) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Remove File
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export async function removeFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let file = (await findById(parseInt(req.params.id))) as File;

  deleteFile(parseInt(req.params.id))
    .then(async (result) => {
      if (!result) return next(new HttpException(404, "File Not Found"));
      try {
        fs.rmSync("." + file.path);
      } catch (err) {
        next(new HttpException(...errMessage(err)));
      }

      handleResponse(res, 200, true, "Deleted Successfully");
    })
    .catch((err) => {
      next(new HttpException(...errMessage(err)));
    });
}

/******************************SharedWith */
/**
 * Get All File
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getSharedWith(req: Request, res: Response, next: NextFunction) {
  findSharedWith(req.user?.unit_id as number)
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get All
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getSeenBy(req: Request, res: Response, next: NextFunction) {
  findUnitsSharedWith(parseInt(req.params.id))
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/*******************************PENDING */

/**
 * Add File
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export async function addToPending(
  req: Request,
  res: Response,
  next: NextFunction
) {
  setPending(req.body.file_id, req.body.selected, req.body.unselected)
    .then((done: any) => {
      handleResponse(res, 201, true, "Shared Successfully");
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Get All File
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function getPendingForUnit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  findPendingForUnit(req.user?.unit_id as number)
    .then((results: any) => {
      handleResponse(res, 200, true, "Retrieved Successfully", results);
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Add File
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export async function acceptFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  moveToShared(parseInt(req.params.id), req.user?.unit_id as number)
    .then((done: any) => {
      handleResponse(res, 201, true, "Shared Successfully");
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}

/**
 * Add File
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export async function refuseFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  deleteFromPending(parseInt(req.params.id), req.user?.unit_id as number)
    .then((done: any) => {
      handleResponse(res, 201, true, "Refused Successfully");
    })
    .catch((err: Error) => {
      next(new HttpException(...errMessage(err)));
    });
}
/************************************************************ */

/**
 * Validate All Input Existant
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function validate(req: Request, res: Response, next: NextFunction) {
  if (!validateKeys(req.body, ["directory"]))
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
  filterObject(req.body, ["name", "directory"]).then((body: any) => {
    if (!Object.keys(body).length)
      return next(new HttpException(400, "There is no Data To Update"));
    req.body = body;
    next();
  });
}

const errMessage = centralizedErrMsgs("File");

export default {
  addFile,
  uploudFile,
  removeFile,
  getFiles,
  getFilesByDirectory,
  getFilesByOwner,
  getById,
  downloadFile,

  getSeenBy,
  getSharedWith,

  addToPending,
  getPendingForUnit,
  acceptFile,
  refuseFile,

  validate,
  filterBody,
};
