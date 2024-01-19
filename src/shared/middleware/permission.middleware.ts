import { Request, Response, NextFunction } from "express";
import HttpException from "../models/HttpException.model";

/*
Permssions  
0 = none
1 = read
2 = write
4 = Delete - edit

Value	Symbol		Value	Symbol		Value	Symbol		Value	Symbol
0	    0	        9	      9	      18	    I	        27	    R
1	    1	        10	    A	      19	    J	        28	    S
2	    2	        11	    B	      20	    K	        29	    T
3	    3	        12	    C	      21	    L	        30	    U
4	    4	        13	    D	      22	    M	        31	    V
5	    5	        14	    E	      23	    N	
6	    6	        15	    F	      24	    O
7	    7	        16	    G	      25	    P
8	    8	        17	    H	      26	    Q	        pad	=

//////////////////
INDEXES:
/user       0
/role       1
/unit       2
/file       3
/directory  4
/pending    5


*/

/**
 * Middleware to Filter Requests By Permission Granted to user
 * @param req
 * @param res
 * @param next
 */
export default function routePermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const permission = req.user?.permission || "";
  if (permission == "") return next(new HttpException(401, "Please, login"));

  let index = -1; // Request API Index


  if (req.baseUrl == "/api/user" || req.baseUrl == "/api/user/add") index = 0;
  else if (req.baseUrl == "/api/role") index = 1;
  else if (req.baseUrl == "/api/unit") index = 2;
  else if (req.baseUrl == "/api/file") index = 3;
  else if (req.baseUrl == "/api/directory") index = 4;
  else if (req.baseUrl == "/api/pending") index = 5;
  else next(new HttpException(400, "BAD REQUEST"));


  if (req.method == "GET" && parseInt(permission[index], 32) % 2 == 1) next();
  else if (req.method == "POST" && (parseInt(permission[index], 32) & 2) == 2)
    next();
  else if (req.method == "PUT" && (parseInt(permission[index], 32) & 4) == 4)
    next();
  else if (req.method == "DELETE" && (parseInt(permission[index], 32) & 8) == 8)
    next();
  else next(new HttpException(403, "YOU ARE NOT ALLWOED TO USE THIS API"));
}
