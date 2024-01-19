import { db } from "../../core";
import SQLError from "../../shared/models/SQLError.model";
import Role from "./role.model";

/**
 * Insert New Role
 * @param tag Role Tag
 * @param title Job Title
 * @param permission Set of Permissions
 * @returns Operation Result || Error Object
 */
export function insertRole(tag: string, title: string, permission: string) {
  return new Promise(async (resolve, reject) => {
    await db<Role>("role")
      .insert({
        tag,
        title,
        permission,
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
 * Find Role By its Tag
 * @param tag Role Tag
 * @returns Role Object || Error Object
 */
export function findByTag(tag: string) {
  return new Promise(async (resolve, reject) => {
    await db<Role>("role")
      .select("*")
      .where({ tag })
      .first()
      .then((role) => {
        resolve(role);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find All Roles
 * @returns Array of All Roles || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<Role>("role")
      .select("*")
      .orderBy(["tag", "title"])
      .then((results: any[]) => {
        resolve(results);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Update Role
 * @param tag Role Tag
 * @param data New Data
 * @returns Operation Result || Error Object
 */
export function updateRole(tag: string, data: any) {
  return new Promise(async (resolve, reject) => {
    await db<Role>("role")
      .where({ tag })
      .first()
      .update(data as { title?: string; permission?: string })
      .then((result) => {
        resolve(result);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Delete Role
 * @param tag Role Tag
 * @returns Operation Result || Error Object
 */
export function deleteRole(tag: string) {
  return new Promise(async (resolve, reject) => {
    await db<Role>("role")
      .where({ tag })
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
