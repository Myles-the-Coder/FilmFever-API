import passportLocal from 'passport-local';
import { User } from './models.js';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { config } from './configs.js';

const LocalStrategy = passportLocal.Strategy;
const options = {}
	options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(),
	options.secretOrKey =  config.passport.secret;
let Users = User;

export const applyLocalPassport = passport => {
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
					console.log('finished');
					return callback(null, user);
				});
			}
		)
	);
};

export const applyJwtStrategy = passport => {
	passport.use(
		new Strategy(options, (jwtPayload, callback) => {
			return Users.findById(jwtPayload._id)
				.then(user => {
					return callback(null, user);
				})
				.catch(err => {
					return callback(err, false);
			});
		})
	);
};
