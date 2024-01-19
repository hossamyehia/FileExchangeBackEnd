import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { findById, findByUsername } from "../../modules/User/user.service";

import { comparePass } from "../../shared/service/auth.service";

import User from "../../modules/User/user.model";

const options = {
  usernameField: "username",
  passwordField: "password",
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

passport.use(
  "local",
  new localStrategy(options, function verify(
    username: string,
    password: string,
    done
  ) {
    findByUsername(username)
      .then((user: User | any) => {
        if (!user) return done(null, false, { message: "User Not Found." });
        if (!comparePass(password, user.password)) {
          return done(null, false, { message: "Incorrect Password." });
        } else {
          let { id, name, title, permission, unit_id, dir_id, unit_type, unit_name } = user;
          return done(null, {
            id: id,
            name: name,
            title: title,
            permission: permission,
            unit_id: unit_id,
            dir_id: dir_id,
            unit_type: unit_type,
            unit_name: unit_name
          });
        }
      })
      .catch((err) => {
        return done(err);
      });
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, (jwt_payload, done) => {
    findById(jwt_payload.id)
      .then((user: User | any) => {
        if (user) return done(null, user);
        else return done(null, false);
      })
      .catch((err) => {
        return done(err, false);
      });
  })
);

export default passport;
