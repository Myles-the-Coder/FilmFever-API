import passport from 'passport'
import passportLocal from 'passport-local';
import { User } from './models.js';
import passportJWT from 'passport-jwt';

function passportConfig() {
	const LocalStrategy = passportLocal.Strategy;
	const JWTStrategy = passportJWT.Strategy;
	const ExtractJWT = passportJWT.ExtractJwt;
	let Users = User;

	passport.use(
		new LocalStrategy(
			{
				usernameField: 'Username',
				passwordField: 'Password',
			},
			(username, password, callback) => {
				console.log(`${username} ${password}`);
				Users.findOne({ Username: username }, (user, err) => {
					if (err) {
						console.log(err);
						return callback(err);
					}

					if (!user) {
						console.log('incorrect username');
						return callback(null, false, {
							message: 'Incorrect username or password.',
						});
					}
				});
			}
		)
	);

	passport.use(
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
				secretOrKey: 'your_jwt_secret',
			},
			(jwtPayload, callback) => {
				return Users.findById(jwtPayload._id)
					.then(user => callback(null, user))
					.catch(err => callback(err));
			}
		)
	);
};

export default passportConfig