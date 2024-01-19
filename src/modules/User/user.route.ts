import { Router } from "express";

import userController from "./user.controller";
import routePermission from "../../shared/middleware/permission.middleware";
import { loginRedirect, loginRequired } from "../../shared/middleware/user.middleware";

const userAPI = Router();

userAPI.route("/")
.get( loginRequired, routePermission, userController.getUsers);

userAPI.route("/login")
.post( loginRedirect, userController.login);

userAPI.route("/add")
.post( loginRequired, routePermission,userController.validate, userController.register);

userAPI.route("/logout")
.post( loginRequired, userController.logout);

userAPI.route("/:id")
.put( loginRequired, routePermission, userController.editUser)
.delete( loginRequired, routePermission, userController.removeUser);

export default userAPI;