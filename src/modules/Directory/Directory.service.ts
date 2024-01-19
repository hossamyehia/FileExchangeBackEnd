import Directory from "./Directory.model";
import { db } from "../../core";
import SQLError from "../../shared/models/SQLError.model";

/**
 * Insert New Directory
 * @param title Directory title
 * @returns Operation Result || Error Object
 */

/**
 * Insert New Directory
 * @param name Directory Name
 * @param path Directory Path
 * @param size Directory Size
 * @param sizeUnit Directory Size Unit
 * @param parent Directory Parent Directory
 * @returns Operation Result || Error Object
 */
export function insertOne(
  name: string,
  path: string,
  size: number = 0,
  sizeUnit: string,
  parent: number = 0,
  owner: number
) {
  return new Promise(async (resolve, reject) => {
    await db<Directory>("directory")
      .insert({
        name,
        path,
        size,
        sizeUnit,
        parent,
        owner,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        if (err.errno === 1062) reject(new Error("Directory already Added"));

        reject(new Error(err));
      });
  });
}

/**
 * Set Directories SharedWith
 * @returns Operation Result || Error Object
 */
export function setSharedWith(dir_id: number, user_id: number) {
  return new Promise(async (resolve, reject) => {
    await db("shared_dir")
      .insert({ 
        dir_id,
        user_id
       })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        if (err.errno === 1062) reject(new Error("Directory already shared with this user"));

        reject(new Error(err));
      });
  });
}

/**
 * Find All Directories
 * @returns Array of All Directory || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<Directory>("directory")
      .select("*")
      .orderBy(["id", "createdAt", "parent", "name"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Directories By Parent Directory
 * @returns Array of All Directory || Error Object
 */
export function findByParent(parent: number) {
  return new Promise(async (resolve, reject) => {
    await db<Directory>("directory")
      .select("*")
      .where({ parent })
      .orderBy(["id", "createdAt", "name"])
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
    await db<Directory>("directory")
      .select("*")
      .where({ owner })
      .orderBy(["id", "createdAt", "name"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find Directory By its id
 * @param id Directory ID
 * @returns Directory Object || Error Object
 */
export function findById(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Directory>("directory")
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
 * Find Directory By its Name
 * @param name Directory Name
 * @returns Directory Object || Error Object
 */
export function findByName(name: string) {
  return new Promise(async (resolve, reject) => {
    await db<Directory>("directory")
      .select("*")
      .where({ name })
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
 * Update Directory
 * @param id Directory ID
 * @param data New Data
 * @returns Operation Result || Error Object
 */
export function updateDirectory(id: number, data: any) {
  return new Promise(async (resolve, reject) => {
    await db<Directory>("directory")
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
 * Delete Directory
 * @param id Directory ID
 * @returns Operation Result || Error Object
 */
export function deleteDirectory(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<Directory>("directory")
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

/************************ Shared */
/**
 * Find Directories By SharedWith
 * @returns Array of All Directory || Error Object
 */
export function findBySharedWith(user_id: number) {
  return new Promise(async (resolve, reject) => {
    await db("shared_dir as SD")
      .join<Directory>("directory as D", "D.id", "SD.dir_id")
      .select("*")
      .where({ user_id })
      .orderBy(["id", "name", "createdAt"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}