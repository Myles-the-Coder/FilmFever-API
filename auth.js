import config  from './configs.js';
import jwt from "jsonwebtoken";
import passport from "passport";

import "./passport.js"; 

let generateJWTToken = user => {
  return jwt.sign(user, config.passport.secret, {
    subject: user.Username,
    expiresIn: config.passport.expiresIn,
    algorithm: "HS256"
  });
};

/* POST login. */
export default router => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "something is not right",
          user: user
        });
      }
      req.login(user, { session: false }, error => {
        if (error) res.send(error);
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};