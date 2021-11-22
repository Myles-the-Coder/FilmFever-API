import passport from 'passport';
import {
	displayErrorMsg,
	resJSON,
	validateInputs,
	checkValidationObject,
} from '../libs/functions.js';
import { Movie, Genre, Director, User } from '../models/models.js';

const Movies = Movie;
const Genres = Genre;
const Directors = Director;
const Users = User;

import '../authentication/passport.js';

export default router => {
	//Express Methods
	router.get('/', (req, res) => res.send('Welcome to FilmFever!'));

	//Return JSON data for all movies
	router.get(
		'/movies',
    passport.authenticate('jwt', { session: false }),
		(req, res) => resJSON(Movies, res)
	);

	//Get data for a single movie
	router.get(
		'/movies/:MovieId',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			Movies.findOne({ _id: req.params.MovieId })
				.then(movie => res.json(movie))
				.catch(err => displayErrorMsg(err));
		}
	);

	//Return JSON data for all genres
	router.get(
		'/genres',
		passport.authenticate('jwt', { session: false }),
		(req, res) => resJSON(Genres, res)
	);

	//Get data on a single genre
	router.get(
		'/genres/:Name',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			Genres.findOne({ Name: req.params.Name })
				.then(genre => res.json(genre))
				.catch(err => displayErrorMsg(err));
		}
	);

	//Return JSON data for all directors
	router.get(
		'/directors',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			resJSON(Directors, res);
		}
	);

	//Return data on a single director
	router.get(
		'/directors/:Name',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			Directors.findOne({ Name: req.params.Name })
				.then(director => res.json(director))
				.catch(err => displayErrorMsg(err));
		}
	);

	//Add new user
	router.post('/signup', validateInputs(), (req, res) => {
		checkValidationObject(req, res);

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

	//Get user by Username
	router.get(
		'/users/:Username',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			Users.findOne({ Username: req.params.Username })
				.then(user => res.json(user))
				.catch(err => displayErrorMsg(err));
		}
	);

	//Update a user's info, by username
	router.put(
		'/users/update/:Username',
		validateInputs(),
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			checkValidationObject(req, res);

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
	router.post(
		'/users/:Username/movies/:MovieID',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			Users.findOneAndUpdate(
				{ Username: req.params.Username },
				{
					$addToSet: {
						FavoriteMovies: req.params.MovieID,
					},
				},
				{ new: true }
			)
				.then(updatedUser => res.json(updatedUser))
				.catch(err => displayErrorMsg(err));
		}
	);

	//Remove a title from user's favorites list
	router.delete(
		'/users/:Username/movies/:MovieID',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			Users.findOneAndUpdate(
				{ Username: req.params.Username },
				{
					$pull: {
						FavoriteMovies: req.params.MovieID,
					},
				},
				{ new: true }
			)
				.then(updatedUser => res.json(updatedUser))
				.catch(err => displayErrorMsg(err));
		}
	);

	//Delete user account by Username
	router.delete(
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
};
