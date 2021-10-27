import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/models.js";
import { Strategy, ExtractJwt } from "passport-jwt";
import dotenv from 'dotenv'

dotenv.config()

let Users = User,
  JWTStrategy = Strategy,
  ExtractJWT = ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password"
    },
    (username, password, callback) => {
      console.log(username + "  " + password);
      Users.findOne({ Username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }
        if (!user) {
          console.log("incorrect username");
          return callback(null, false, {
            message: "Incorrect username."
          });
        }

        if(!user.validatePassword(password)) {
          console.log('Incorrect Password')
          return callback(null, false, {message: 'Incorrect password.'})
        }
        console.log("finished");
        return callback(null, user);
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then(user => callback(null, user))
        .catch(error => callback(error));
    }
  )
);
