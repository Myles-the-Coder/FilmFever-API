'use strict';
import express from 'express';
import morgan from 'morgan';
import { Movie, Genre, Director, User } from './models.js';
import mongoose from 'mongoose';
import auth from './auth.js';
import passport from 'passport';
import { applyLocalPassport, applyJwtStrategy } from './passport.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('common'));
app.use(express.static(`public`));
app.use(passport.initialize())

const Movies = Movie;
const Genres = Genre;
const Directors = Director;
const Users = User;

mongoose.connect('mongodb://localhost:27017/filmfeverDB', {
  useNewUrlParser: true,
	useUnifiedTopology: true,
});

auth(app);
applyLocalPassport(passport)
applyJwtStrategy(passport)

function displayErrorMsg(err) {
	console.error(err);
	res.status(500).send(`Error: ${err}`);
}

function resJSON(model, res) {
	return model.find().then(data => res.json(data));
}

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
app.post('/signup', (req, res) => {
	Users.findOne({ Username: req.body.Username })
		.then(user => {
			if (user) {
				return res.status(400).send(`${req.body.Username} already exists`);
			} else {
				Users.create({
					Username: req.body.Username,
					Password: req.body.Password,
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
	'/accounts',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.find()
			.then(users => res.status(201).json(users))
			.catch(err => displayErrorMsg(err));
	}
);
//Get user by Username
app.get(
	'/accounts/:Username',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOne({ Username: req.params.Username })
			.then(user => res.json(user))
			.catch(err => displayErrorMsg(err));
	}
);

//Update a user's info, by username
app.put(
	'/accounts/update/:Username',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		User.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$set: {
					Username: req.body.Username,
					Password: req.body.Password,
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
	'/accounts/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		User.findOneAndUpdate(
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
	'/accounts/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		User.findOneAndUpdate(
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
	'/accounts/:Username',
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

app.listen(3000, () => console.log('Your app is running on Port 3000'));
