import bcrypt from "bcryptjs";
import { db } from "../../core";
import User from "./user.model";
import SQLError from "../../shared/models/SQLError.model";

/**
 * Insert New User
 * @param username Username
 * @param password Password
 * @param name Name
 * @param role Role Tag "ID"
 * @returns Success MSG || Error Object
 */
export function insertUser(
  name: string,
  username: string,
  password: string,
  role: string,
  unit_id: number
) {
  return new Promise(async (resolve, reject) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    await db<User>("user")
      .insert({
        name,
        username,
        password: hash,
        role,
        unit_id
      })
      .then((user) => {
        resolve(user);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find User Information And Role By ID
 * @param id User`s ID
 * @returns User Object || Error Object
 */
export function findById(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<User>("user")
      .join("role as R", "R.tag", "user.role")
      .join("unit as U", "U.id", "user.unit_id")
      /*
      .join("branch_unit as BU", "user.branch_unit", "BU.branch_id")
      .join("branch as B", "B.id", "BU.branch_id")
      .join("unit as U", "U.id", "BU.unit_id")
      */
      .select()
      .select(
        "user.id as id",
        "user.name as name",
        "user.username as username",
        "user.role as role",
        "user.unit_id as unit_id",
        "R.title as title",
        "R.permission as permission",
        "U.name as unit_name",
        "U.dir_id as dir_id",
        "U.master as unit_type",
        /*
        "user.branch_unit as branch_unit",
        "BU.branch_id as branch_id",
        "BU.unit_id as unit_id",
        "U.name as unit_name",
        "B.name as branch_name"
        */
      )
      .where({ "user.id": id })
      .first()
      .then((user) => {
        resolve(user);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find User Information And Role By Username
 * @param username Username
 * @returns User Object || Error Object
 */
export function findByUsername(username: string) {
  return new Promise(async (resolve, reject) => {
    await db<User>("user")
      .join("role as R", "R.tag", "user.role")
      .join("unit as U", "U.id", "user.unit_id")
      .select(
        "user.id as id",
        "user.name as name",
        "user.username as username",
        "user.password as password",
        "user.role as role",
        "user.unit_id as unit_id",
        "R.title as title",
        "R.permission as permission",
        "U.name as unit_name",
        "U.dir_id as dir_id",
        "U.master as unit_type",
      )
      .where({ username })
      .first()
      .then((user) => {
        resolve(user);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Find ALL Users Information
 * @returns Array of Users || Error Object
 */
export function find() {
  return new Promise(async (resolve, reject) => {
    await db<User>("user")
      .join("role as R", "R.tag", "user.role")
      .join("unit as U", "U.id", "user.unit_id")
      .select()
      .select(
        "user.id as id",
        "user.name as name",
        "user.username as username",
        "user.role as role",
        "user.unit_id as unit_id",
        "R.title as title",
        "R.permission as permission",
        "U.name as unit_name",
        "U.dir_id as dir_id",
        "U.master as unit_type",
      )
      .then((users) => {
        resolve(users);
      })
      .catch((err: SQLError | any) => {
        reject(err);
      });
  });
}

/**
 * Update User
 * @param id User`s ID
 * @param data New Information
 * @returns Operation Result || Error Object
 */
export function updateUser(id: number, data: any) {
  return new Promise(async (resolve, reject) => {
    data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync());

    await db<User>("user")
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
 * Delete User
 * @param id User`s ID
 * @returns Operation Result || Error Object
 */
export function deleteUser(id: number) {
  return new Promise(async (resolve, reject) => {
    await db<User>("user")
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
