'use strict';
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import { Movie, Genre, Director, User } from './models.js';
import { displayErrorMsg, resJSON, validateInputs } from './functions.js';
import auth from './auth.js';
import { validationResult } from 'express-validator';

dotenv.config();

const Movies = Movie;
const Genres = Genre;
const Directors = Director;
const Users = User;

const app = express();

mongoose
	.connect('mongodb://localhost:27017/filmfeverDB', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(res => console.log('DB Connected!'))
	.catch(err => console.log(err, err.message));

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				let message = `The CORS policy for this application doesn't allow access from origin ${origin}`;
				return callback(new Error(message), false);
			}
			return callback(null, true);
		},
	})
);

app.use(passport.initialize());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(`public`));
app.use(morgan('common'));

auth(app);
import './passport.js';

//Express Methods
app.get('/', (req, res) => res.send('Welcome to FilmFever!'));

//Return JSON data for all movies
app.get(
	'/movies',
	passport.authenticate('jwt', { session: false }),
	(req, res) => resJSON(Movies, res)
);

//Get data for a single movie
app.get(
	'/movies/:Title',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ Title: req.params.Title })
			.then(movie => res.json(movie))
			.catch(err => displayErrorMsg(err));
	}
);

//Return JSON data for all genres
app.get(
	'/genres',
	passport.authenticate('jwt', { session: false }),
	(req, res) => resJSON(Genres, res)
);

//Get data on a single genre
app.get(
	'/genres/:Genre',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Genres.findOne({ Name: req.params.Genre })
			.then(genre => res.json(genre))
			.catch(err => displayErrorMsg(err));
	}
);

//Return JSON data for all directors
app.get(
	'/directors',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		resJSON(Directors, res);
	}
);

//Return data on a single director
app.get(
	'/directors/:Name',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Directors.findOne({ Name: req.params.Name })
			.then(director => res.json(director))
			.catch(err => displayErrorMsg(err));
	}
);

//Add new user
app.post('/signup', validateInputs(), (req, res) => {
	let errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(422).json({ errors: errors.array() });

	Users.findOne({ Username: req.body.Username })
		.then(user => {
			if (user) {
				return res.status(400).send(`${req.body.Username} already exists`);
			} else {
				let hashedPassword = Users.hashPassword(req.body.Password);
				Users.create({
					Username: req.body.Username,
					Password: hashedPassword,
					Email: req.body.Email,
					Birthday: req.body.Birthday,
				})
					.then(user => res.status(201).json(user))
					.catch(err => {
						console.error(err);
						res.status(500).send(`Error ${err}`);
					});
			}
		})
		.catch(err => displayErrorMsg(err));
});

//Get all user accounts
app.get(
	'/users',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.find()
			.then(users => res.status(201).json(users))
			.catch(err => displayErrorMsg(err));
	}
);

//Get user by Username
app.get(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOne({ Username: req.params.Username })
			.then(user => res.json(user))
			.catch(err => displayErrorMsg(err));
	}
);

//Update a user's info, by username
app.put(
	'/users/update/:Username',
	validateInputs(),
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(422).json({ errors: errors.array() });

		let hashedPassword = Users.hashPassword(req.body.Password);
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$set: {
					Username: req.body.Username,
					Password: hashedPassword,
					Email: req.body.Email,
					Birthday: req.body.Birthday,
				},
			},
			{ new: true }
		)
			.then(updatedUser => res.json(updatedUser))
			.catch(err => displayErrorMsg(err));
	}
);

//Add a title to a user's favorites list
app.post(
	'/users/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$addToSet: {
					Favorites: req.params.MovieID,
				},
			},
			{ new: true }
		)
			.then(updatedUser => res.json(updatedUser))
			.catch(err => displayErrorMsg(err));
	}
);

//Remove a title from user's favorites list
app.delete(
	'/users/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$pull: {
					Favorites: req.params.MovieID,
				},
			},
			{ new: true }
		)
			.then(updatedUser => res.json(updatedUser))
			.catch(err => displayErrorMsg(err));
	}
);

//Delete user account by Username
app.delete(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndRemove({ Username: req.params.Username })
			.then(user => {
				user
					? res.status(200).send(`${req.params.Username} was deleted.`)
					: res.status(400).send(`${req.params.Username} was not found.`);
			})
			.catch(err => displayErrorMsg(err));
	}
);

app.use((req, res, err, next) => {
	if (err) {
		console.error(err.stack);
		res.status(500).send('Something broke!');
	}
	next();
});

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => console.log(`Listening on Port ${port}`));
