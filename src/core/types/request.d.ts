
import UserModel from "../models/token.model";

declare global {
    namespace Express {      
        interface User extends UserModel {
        }
    }
}