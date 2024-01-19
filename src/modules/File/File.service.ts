import File from "./File.model";
import { db } from "../../core";
import SQLError from "../../shared/models/SQLError.model";

/**
 * Insert New File
 * @param title File title
 * @returns Operation Result || Error Object
 */

/**
 * Insert New File
 * @param name File Name
 * @param path File Path
 * @param size File Size
 * @param parent File Parent File
 * @returns Operation Result || Error Object
 */
export function insertOne(
  name: string,
  path: string,
  size: number = 0,
  sizeUnit: string,
  type: string,
  directory: number = 0,
  owner: number
) {
  return new Promise(async (resolve, reject) => {
    await db<File>("file")
      .insert({
        name,
        path,
        size,
        sizeUnit,
        type,
        directory,
        owner,
      })
      .returning("id")
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find All Files
 * @returns Array of All File || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<File>("file")
      .select("*")
      .orderBy(["id", "directory", "name", "createdAt"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Files By directory
 * @returns Array of All File || Error Object
 */
export function findByDirectory(directory: number) {
  return new Promise(async (resolve, reject) => {
    await db<File>("file")
      .select("*")
      .where({ directory })
      .orderBy(["id", "name", "createdAt"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Directories By Owner
 * @returns Array of All Directory || Error Object
 */
export function findByOwner(owner: number) {
  return new Promise(async (resolve, reject) => {
    await db<File>("file")
      .select("*")
      .where({ owner })
      .orderBy(["id", "name", "createdAt"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find File By its id
 * @param id File ID
 * @returns File Object || Error Object
 */
export function findById(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<File>("file")
      .select("*")
      .where({ id })
      .first()
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Delete File
 * @param id File ID
 * @returns Operation Result || Error Object
 */
export function deleteFile(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<File>("file")
      .where({ id })
      .first()
      .delete()
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/******************************************SharedWith */
/**
 * Set Files To Pending Share
 * @returns Operation Result || Error Object
 */
export function findUnitsSharedWith(file_id: number) {
  return new Promise(async (resolve, reject) => {
    await db
      .transaction(async (trx) => {
        let queries: any[] = [
          db("pending_file")
            .select("unit_id as id")
            .where({ file_id })
            .transacting(trx),
          db("shared_file")
            .select("unit_id as id")
            .where({ file_id })
            .transacting(trx),
        ];
        return Promise.all(queries).then(trx.commit).catch(trx.rollback);
      })
      .then(function (values) {
        resolve([
          ...[...values[0]].map((value) => value["id"]),
          ...[...values[1]].map((value) => value["id"]),
        ]);
      })
      .catch(function (error: any) {
        reject(error);
      });
  });
}

/**
 * Find Files By directory
 * @returns Array of All File || Error Object
 */
export function findSharedWith(unit_id: number) {
  return new Promise(async (resolve, reject) => {
    await db("shared_file")
      .join("file", "file.id", "shared_file.file_id")
      .select("file.*")
      .where({ unit_id })
      .orderBy("shared_file.createdAt", 'desc')
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/******************************************Pending */
/**
 * Set Files To Pending Share
 * @returns Operation Result || Error Object
 */
export function setPending(
  file_id: number,
  selectedUnits: number[],
  unselectedUnits: number[]
) {
  return new Promise(async (resolve, reject) => {
    await db
      .transaction(async (trx) => {
        let queries: any[] = [];
        let pending_file = null;

        for (const id of unselectedUnits) {
          pending_file = await db("pending_file")
            .where({ file_id, unit_id: id })
            .first()
            .delete();

          if (!pending_file) {
            queries.push(
              db("shared_file")
                .where({ file_id, unit_id: id })
                .first()
                .delete()
                .transacting(trx)
            );
          }
        }

        for (const id of selectedUnits) {
          queries.push(
            db("pending_file")
              .insert({
                file_id,
                unit_id: id,
              })
              .transacting(trx)
          );
        }

        return Promise.all(queries).then(trx.commit).catch(trx.rollback);
      })
      .then(function (values) {
        resolve(values);
      })
      .catch(function (error: any) {
        reject(error);
      });
  });
}

/**
 * Find Pending files
 * @returns Operation Result || Error Object
 */
export function findPendingForUnit(unit_id: number) {
  return new Promise(async (resolve, reject) => {
    await db("pending_file")
      .join("file", "file.id", "pending_file.file_id")
      .select("file.*")
      .where({ unit_id })
      .orderBy("pending_file.createdAt", "desc")
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Add to Share
 * @returns Operation Result || Error Object
 */
export function moveToShared(file_id: number, unit_id: number) {
  return new Promise(async (resolve, reject) => {
    await db
      .transaction(async (trx) => {
        let queries: any[] = [
          db("pending_file")
            .where({ unit_id, file_id })
            .first()
            .delete()
            .transacting(trx),
          db("shared_file")
            .insert({
              file_id,
              unit_id,
            })
            .transacting(trx),
        ];
        return Promise.all(queries).then(trx.commit).catch(trx.rollback);
      })
      .then(function (values) {
        resolve(values);
      })
      .catch(function (error: any) {
        reject(error);
      });
  });
}

/**
 * Delete File From Pending
 * @param id File ID
 * @returns Operation Result || Error Object
 */
export function deleteFromPending(file_id: number, unit_id: number) {
  return new Promise(async (resolve, reject) => {
    await db("pending_file")
      .where({ file_id, unit_id })
      .first()
      .delete()
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}
