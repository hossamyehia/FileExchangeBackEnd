import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 

import configs from '../../core/config/configs.config';
import User from '../../modules/User/user.model';


export function comparePass(userPassword: string, databasePassword: string) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

export function getToken(user: User | any) {
  return jwt.sign(user, configs.SECRET,
      {expiresIn: "60m"});
};
