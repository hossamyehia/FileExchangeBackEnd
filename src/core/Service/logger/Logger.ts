import { Console } from "console";
import * as fs from "fs";
import SQLError from "../../../shared/models/SQLError.model";

export default function Log(err: SQLError | Error | any) {
  const genName = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
  const logFile = fs.createWriteStream(`./logs/${genName}.log`, { flags: "a" });
  // Custom simple logger
  const Logger = new Console({ stdout: logFile, stderr: logFile });

  Logger.log("-----------------------------");
  err.errno && Logger.log(`[SQL ERROR]`);
  !err.errno && Logger.log(`[Internal ERROR]`);
  Logger.group();
  err.code && Logger.log("Code: ", err.code);
  err.errno && Logger.log("Number: ", err.errno);
  Logger.log("Message: ", err.sqlMessage || err.message);
  !err.errno && Logger.log("Stack: ", err.stack);
  Logger.groupEnd();
}
