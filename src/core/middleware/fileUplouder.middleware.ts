import util from "util";
import multer from "multer";
import * as crypto from "crypto";

const maxSize = 4 * 1024 * 1024 * 1024;

import { StringDecoder } from 'node:string_decoder';
import HttpException from "../../shared/models/HttpException.model";
import { centralizedErrMsgs } from "../../shared/utils";
import { findById } from "../../modules/Directory/Directory.service";
const decoder = new StringDecoder('utf8');

let fileconfig = {
  filelocation: "./uploads",
};

let storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      let dir = await findById(req.user?.dir_id as number);
      if (dir) return cb(null, "." + (dir as { [path: string]: string }).path);
      cb(null, fileconfig.filelocation);
      
    } catch (err) {
      cb(new HttpException(...errMessage(err)), fileconfig.filelocation);
    }
    
  },
  filename: (req, file, cb) => {
    let m = file.originalname.match(/([^:\\/]*?)(?:\.([^ :\\/.]*))?$/);
    let fileExt = m === null ? "" : m[2];
    let fileName = crypto.randomBytes(5).toString("hex") + "." + fileExt;
    cb(null, fileName);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

const errMessage = centralizedErrMsgs("File");

export default uploadFileMiddleware;
