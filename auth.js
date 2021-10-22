import passport from 'passport';
import passportConfig from './passport.js';
import pkg from 'jsonwebtoken';
const { Jwt } = pkg;

passportConfig(passport); 

const jwtSecret = 'your_jwt_secret'

function generateJWTToken(user) {
  const expiresIn = '7d'
  const signedToken = Jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn, 
    algorithm: 'HS256'
  });

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn
  }
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