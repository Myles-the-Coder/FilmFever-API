'use strict';
import express from 'express';
import morgan from 'morgan';
import { Movie, Genre, Director, User } from './models.js';
import mongoose from 'mongoose';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Movies = Movie;
const Genres = Genre;
const Directors = Director;
const Users = User;

mongoose.connect('mongodb://localhost:27017/filmfeverDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

function displayErrorMsg(err) {
	console.error(err);
	res.status(500).send(`Error: ${err}`);
}

function resJSON(model, res) {
	return model.find().then(data => res.json(data));
}

app.use(morgan('common'));
app.use(express.static(`public`));

//Express Methods
app.get('/', (req, res) => res.send('Welcome to FilmFever!'));

//Return JSON data for all movies
app.get('/movies', (req, res) => resJSON(Movies, res));

//Get data for a single movie
app.get('/movies/:Title', (req, res) => {
	Movies.findOne({ Title: req.params.Title })
		.then(movie => res.json(movie))
		.catch(err => displayErrorMsg(err));
});

//Return JSON data for all genres
app.get('/genres', (req, res) => resJSON(Genres, res));

//Get data on a single genre
app.get('/genres/:Genre', (req, res) => {
	Genres.findOne({ Name: req.params.Genre })
		.then(genre => res.json(genre))
		.catch(err => displayErrorMsg(err));
});

//Return JSON data for all directors
app.get('/directors', (req, res) => {
	resJSON(Directors, res);
});

//Return data on a single director
app.get('/directors/:Name', (req, res) => {
	Directors.findOne({ Name: req.params.Name })
		.then(director => res.json(director))
		.catch(err => displayErrorMsg(err));
});

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
app.get('/accounts', (req, res) => {
	Users.find()
		.then(users => res.status(201).json(users))
		.catch(err => displayErrorMsg(err));
});
//Get user by Username
app.get('/accounts/:Username', (req, res) => {
	Users.findOne({ Username: req.params.Username })
		.then(user => res.json(user))
		.catch(err => displayErrorMsg(err));
});

//Update a user's info, by username
app.put('/accounts/update/:Username', (req, res) => {
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
});

//Add a title to a user's favorites list
app.post('/accounts/:Username/movies/:MovieID', (req, res) => {
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
});

//Remove a title from user's favorites list
app.delete('/accounts/:Username/movies/:MovieID', (req, res) => {
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
});

//Delete user account by Username
app.delete('/accounts/:Username', (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
		.then(user => {
			user
				? res.status(200).send(`${req.params.Username} was deleted.`)
				: res.status(400).send(`${req.params.Username} was not found.`);
		})
		.catch(err => displayErrorMsg(err));
});

app.use((req, res, err, next) => {
	if (err) {
		console.error(err.stack);
		res.status(500).send('Something broke!');
	}
	next();
});

app.listen(3000, () => console.log('Your app is running on Port 3000'));
