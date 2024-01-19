import { Router, Request, Response } from "express";


import { loginRequired } from "../../shared/middleware/user.middleware";
import routePermission from "../../shared/middleware/permission.middleware";


const apiRoutes = Router();

apiRoutes.route('/').get(async (req: Request, res: Response, next: any) => {
    res.json({author: "Hossam Yahia Abdelkader Adbelmoneam"})
});

//  Test Route
import testRoutes from "./test.route";
apiRoutes.use("/test", testRoutes);

//  USER Route
import userAPI from "../../modules/User/user.route";
apiRoutes.use('/user', userAPI);

//  Role Route
import roleAPI from "../../modules/Role/role.route";
apiRoutes.use('/role', loginRequired, routePermission, roleAPI);

//  Directory Route
import directoryAPI from "../../modules/Directory/Directory.route";
apiRoutes.use('/directory', loginRequired, routePermission, directoryAPI);

//  File Route
import fileAPI from "../../modules/File/File.route";
apiRoutes.use('/file', loginRequired, routePermission, fileAPI);

//  Pending Route
import pendingAPI from "../../modules/File/pending/pending.route";
apiRoutes.use('/pending', loginRequired, routePermission, pendingAPI);

//  Unit Route
import unitAPI from "../../modules/Unit/Unit.route";
apiRoutes.use('/unit', loginRequired, routePermission, unitAPI);


export default apiRoutes;