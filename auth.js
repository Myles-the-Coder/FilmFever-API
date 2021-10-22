import passport from 'passport';
import jwt from 'jsonwebtoken';
import {config} from './configs.js'
import { applyJwtStrategy, applyLocalPassport } from './passport.js';

applyLocalPassport(passport)
applyJwtStrategy(passport)

let generateJWTToken = (user) => {
  return jwt.sign(user, config.passport.secret, {
    subject: user.Username,
    expiresIn: config.passport.expiresIn, 
    algorithm: 'HS256'
  });
}


let auth = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}

export default auth