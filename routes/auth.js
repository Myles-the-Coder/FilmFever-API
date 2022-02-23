import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from 'dotenv'

dotenv.config()

import "../authentication/passport.js"; 
/**
 * This function generates a JWT to authenticate user 
 * @param {string} user 
 * @returns JSON Web Token
 */
let generateJWTToken = user => {
  return jwt.sign(user, process.env.SECRET, {
    subject: user.Username,
    expiresIn: '7d',
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
          user
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