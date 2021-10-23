'use strict';
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Models = require('./models')

const Movies = Models.Movie;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

function displayErrorMsg(err) {
  console.error(err);
  res.status(500).send(`Error: ${err}`);
}

function resJSON(model, res) {
  return model.find().then(data => res.json(data));
}

const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/filmfeverDB', {
  useNewUrlParser: true,
	useUnifiedTopology: true,
});

let auth = require('./auth')(app)
const passport = require('passport')
require('./passport')

app.use(express.static(`public`));

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
app.post('/users', (req, res) => {
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
	'/users',
	// passport.authenticate('jwt', { session: false }),
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
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
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
	// passport.authenticate('jwt', { session: false }),
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
