import Unit from "./Unit.model";
import { db } from "../../core";
import SQLError from "../../shared/models/SQLError.model";

/**
 * Insert New Unit
 * @param name Unit Name
 * @returns Operation Result || Error Object
 */
export function insertOne(
  name: string,
  dir_id: number,
  master: number,
  master_id: number
) {
  return new Promise(async (resolve, reject) => {
    await db<Unit>("unit")
      .insert({
        name,
        dir_id,
        master,
        master_id,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find All Unit
 * @returns Array of All Unit || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<Unit>("unit")
      .join("unit as master", "master.id", "unit.master_id")
      .join("directory", "directory.id", "unit.dir_id")
      .select(
        "unit.id as id",
        "unit.name as name",
        db.raw('IF(unit.master=0,"✖","✔") AS unit_type'),
        "unit.master as master",
        "unit.dir_id as dir_id",
        "unit.master_id as master_id",
        "master.name as master_name",
        "directory.name as dir_name"
      )
      .orderBy(["unit.id"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Units By Type
 * @param type
 */
export function findByUnitType(id: number, type: number) {
  return new Promise(async (resolve, reject) => {
    await db<Unit>("unit")
      .select("*")
      .where({ master: type })
      /*.whereNot({ id: id })*/
      .orderBy(["id", "name"])
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Unit By its id
 * @param id Unit ID
 * @returns Unit Object || Error Object
 */
export function findSlaves(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Unit>("unit")
      .select("*")
      .where({ master_id: id })
      .orderBy(["id", "name"])
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}


/**
 * Find Unit Relatives
 * @param id Unit ID
 * @returns Unit Object || Error Object
 */
export function findRelatives(id: number) {
  return new Promise(async (resolve, reject) => {
    await db
      .transaction(async (trx) => {
        let queries: any[] = [
          db<Unit>("unit as Master")
            .join("unit as Slave", "Slave.master_id", "Master.id")
            .select("Master.*")
            .where({ "Slave.id": id })
            .transacting(trx)
            .first(),
          db<Unit>("unit")
            .select("*")
            .where({ master_id: id })
            .orderBy(["id", "name"])
            .transacting(trx),
        ];
        return Promise.all(queries).then(trx.commit).catch(trx.rollback);
      })
      .then(function (values) {
        resolve([values[0], ...values[1]]);
      })
      .catch(function (error: any) {
        reject(error);
      });
  });
}

/**
 * Find Unit By its id
 * @param id Unit ID
 * @returns Unit Object || Error Object
 */
export function findById(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Unit>("unit")
      .join("directory", "directory.id", "unit.dir_id")
      .select("unit.*", "directory.name as dir_name")
      .where({ "unit.id": id })
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
 * Find Unit By its id
 * @param id Unit ID
 * @returns Unit Object || Error Object
 */
export function findMaster(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Unit>("unit as Master")
      .join("unit as Slave", "Slave.master_id", "Master.id")
      .select("Master.*")
      .where({ "Slave.id": id })
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
 * Update Unit
 * @param id Unit ID
 * @param data New Data
 * @returns Operation Result || Error Object
 */
export function updateUnit(id: number, data: any) {
  return new Promise(async (resolve, reject) => {
    await db<Unit>("unit")
      .where({ id })
      .first()
      .update(data)
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Delete Unit
 * @param id Unit ID
 * @returns Operation Result || Error Object
 */
export function deleteUnit(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Unit>("unit")
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
