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

/**
 * @swagger
 * components:
 *  schemas:
 *    Movie:
 *      type: object
 *      properties:
 *        _id:
 *         type: string
 *         example: 6178814b0b372a23838952a5
 *        Title:
 *         type: string
 *         example: The Godfather
 *        Description:
 *         type: string
 *         example: The Godfather came out in 1972...
 *        Genre:
 *         type: object
 *         properties:
 *          Name:
 *           type: string
 *           example: Drama
 *          Description:
 *           type: string
 *           example: Drama is a genre characterized by...
 *        Director:
 *          type: object
 *          properties:
 *           Name:
 *            type: string
 *            example: Francis Ford Coppola
 *           Bio:
 *            type: string
 *            example: Francis Ford Coppola was born...
 *        ImagePath:
 *          type: string
 *          example: https://th.bing.com/th/id/OIP.EkDaV-ETeaVe1TfXGfPL0AHaLH?pid=ImgDet&rs=1
 *        Featured:
 *          type: boolean
 *    Genre:
 *     type: object
 *     properties:
 *         _id:
 *          type: integer
 *          example: 6178814b0b372a23838952a5
 *         Name:
 *          type: string
 *          example: Drama
 *         Description:
 *           type: string
 *           example: Drama is a genre characterized by...
 *    Director:
 *     type: object
 *     properties:
 *         _id:
 *          type: integer
 *          example: 6178814b0b372a23838952a5
 *         Name:
 *          type: string
 *          example: Alfred Hitchcock
 *         Bio:
 *           type: string
 *           example: Alfred Hitchcock was an English film director...
 *         Birthdate:
 *           type: string
 *           example: 1939-04-07T07:00:00.000+00:00
 *           format: date-time
 *         Deathdate:
 *           type: string
 *           example: 1980-04-29T06:00:00.000+00:00
 *           format: date-time
 *    User:
 *     type: object
 *     properties:
 *        _id:
 *          type: integer
 *          example: 6178814b0b372a23838952a5
 *        Username:
 *          type: string
 *          description: The user's name.
 *          example: Jane Doe
 *        Email:
 *           type: string
 *           example: placeholder@gmail.com
 *        Password:
 *           type: string
 *           example: $P$984478476IagS59wHZvyQMArzfx58u
 *        Birthday:
 *           type: string
 *           format: date-time
 *           example: 1998-06-07T07:00:00.000+00:00
 *        FavoriteMovies:
 *           type: array
 *           items:
 *             type: string
 *             example: 6178814b0b372a23838952a5
 *    UserParameter:
 *     
 */

//Express Methods
export default router => {
	router.get('/', (req, res) => res.send('Welcome to FilmFever!'));

	//Return JSON data for all movies
	/**
	 * @swagger
	 * /movies:
	 *    get:
	 *      summary: Retrieve a JSON object holding data about all the movies.
	 *      description: Retrieve a JSON object holding data about all the movies.
	 *      responses:
	 *        200:
	 *          description: A list of movies
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                    data:
	 *                      type: array
	 *                      items:
	 *                        $ref: '#/components/schemas/Movie'
	 */
	router.get(
		'/movies',
		passport.authenticate('jwt', { session: false }),
		(req, res) => resJSON(Movies, res)
	);

	//Get data for a single movie
	/**
	 * @swagger
	 * /movies/:MovieId:
	 *    get:
	 *      summary: Retrieve a JSON object holding data about a single movie by ID.
	 *      description: Retrieve a JSON object holding data about a single the movies.
	 *      parameters:
	 *        - in: path
	 *          name: MovieId
	 *          required: true
	 *          description: Id of movie
	 *          schema:
	 *            $ref: '#/components/schemas/Movie/properties/_id'
	 *      responses:
	 *        200:
	 *          description: Retrieve a JSON object holding data about a single movie by ID.
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/Movie'
	 */
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
	/**
	 * @swagger
	 * /genres:
	 *   get:
	 *    summary: A JSON object holding data about all available genres
	 *    responses:
	 *      200:
	 *       description: A list of genres
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: array
	 *             items:
	 *              $ref: '#/components/schemas/Genre'
	 */
	router.get(
		'/genres',
		passport.authenticate('jwt', { session: false }),
		(req, res) => resJSON(Genres, res)
	);

	//Get data on a single genre
	/**
	 * @swagger
	 * /genre/:Name:
	 *   get:
	 *    summary: A JSON object holding data about a single genre by name
	 *    parameters:
	 *      - in: path
	 *        name: Name
	 *        required: true
	 *        description: Name of genre
	 *        schema:
	 *          $ref: '#/components/schemas/Genre/properties/Name'
	 *    responses:
	 *      200:
	 *       description: A JSON object holding data about a single genre by name
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/Genre'
	 */
	router.get(
		'/genres/:Name',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
      const {Name} = req.params;
			Genres.findOne({ Name })
				.then(genre => res.json(genre))
				.catch(err => displayErrorMsg(err));
		}
	);

	//Return data on all directors
	/**
	 * @swagger
	 * /directors:
	 *   get:
	 *    summary: A JSON object holding data about all directors in database.
	 *    responses:
	 *      200:
	 *       description: A JSON object holding data about all directors in database.
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: array
	 *             items:
	 *                $ref: '#/components/schemas/Director'
	 */

	//Return JSON data for all directors
	router.get(
		'/directors',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			resJSON(Directors, res);
		}
	);

	//Return data on a single director
	/**
	 * @swagger
	 * /directors/:Name:
	 *   get:
	 *    summary: A JSON object holding data about a single director by name
	 *    parameters:
	 *      - in: path
	 *        name: Name
	 *        required: true
	 *        description: Name of director
	 *        schema:
	 *          $ref: '#/components/schemas/Director/properties/Name'
	 *    responses:
	 *      200:
	 *       description: A JSON object holding data about a single director by name
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/Director'
	 */
	router.get(
		'/directors/:Name',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
      const {Name} = req.params;
			Directors.findOne({ Name })
				.then(director => res.json(director))
				.catch(err => displayErrorMsg(err));
		}
	);

	//Validate user inputs and, if valid, add user to database
	/**
	 * @swagger
	 * /signup:
	 *   post:
	 *     summary: Validate user inputs and, if valid, add user to database.
	 *     description: Validate user inputs and, if valid, add user to database. Can be used to populate a user profile when prototyping or testing an API.
	 *     responses:
	 *       201:
	 *         description: Validate user inputs and, if valid, add user to database. Can be used to populate a user profile when prototyping or testing an API.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 */
	router.post('/signup', validateInputs(), (req, res) => {
		checkValidationObject(req, res);
		const { Username, Password, Email, Birthday } = req.body;
		Users.findOne({ Username })
			.then(user => {
				if (user) {
					return res.status(400).send(`${Username} already exists`);
				} else {
					let hashedPassword = Users.hashPassword(Password);
					Users.create({
						Username,
						Password: hashedPassword,
						Email,
						Birthday,
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
	/**
	 * @swagger
	 * /users/:Username:
	 *   get:
	 *     summary: Retrieve a single user. Can be used to populate a user profile when prototyping or testing an API.
	 *     description: Retrieve a single user. Can be used to populate a user profile when prototyping or testing an API.
	 *     parameters:
	 *       - in: path
	 *         name: Username
	 *         required: true
	 *         description: User's username
	 *         schema:
	 *           $ref: '#/components/schemas/User/properties/Username'
	 *     responses:
	 *       200:
	 *         description: Retrieve a single user. Can be used to populate a user profile when prototyping or testing an API.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 */
	router.get(
		'/users/:Username',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			const { Username } = req.params;
			Users.findOne({ Username })
				.then(user => res.json(user))
				.catch(err => displayErrorMsg(err));
		}
	);

	/**
	 * @swagger
	 * /users/update/:Username:
	 *   put:
	 *     summary: Validate user inputs and, if valid, update user information in database.
	 *     description: Validate user inputs and, if valid, update user information in database.
	 *     parameters:
	 *       - in: path
	 *         name: Username
	 *         required: true
	 *         description: User's username
	 *         schema:
	 *           $ref: '#/components/schemas/User/properties/Username'
	 *     responses:
	 *       201:
	 *         description: Validate user inputs and, if valid, update user information in database.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 */

	//Validate user inputs. If valid, update a user's info, by username
	router.put(
		'/users/update/:Username',
		validateInputs(),
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			checkValidationObject(req, res);
			const { Username, Password, Email, Birthday } = req.body;
			let hashedPassword = Users.hashPassword(Password);
			Users.findOneAndUpdate(
				{ Username: req.params.Username },
				{
					$set: {
						Username,
						Password: hashedPassword,
						Email,
						Birthday,
					},
				},
				{ new: true }
			)
				.then(updatedUser => res.json(updatedUser))
				.catch(err => displayErrorMsg(err));
		}
	);
	/**
	 * @swagger
	 * /users/:Username/movies/:MovieID:
	 *   post:
	 *     summary: Add a movie to user's favorites list by movie ID.
	 *     description: Add a movie to user's favorites list by movie ID.
	 *     parameters:
	 *       - in: path
	 *         name: Username
	 *         required: true
	 *         description: user's username
	 *         schema:
	 *          $ref: '#/components/schemas/User/properties/Username'
	 *       - in: path
	 *         name: MovieID
	 *         required: true
	 *         description: ID of movie to be added to favorites list
	 *         schema:
	 *           $ref: '#/components/schemas/Movie/properties/_id'
	 *     responses:
	 *       201:
	 *         description: Add a movie to user's favorites list by movie ID..
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 */
	//Add a title to a user's favorites list
	router.post(
		'/users/:Username/movies/:MovieID',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			const { Username, MovieID } = req.params;
			Users.findOneAndUpdate(
				{ Username },
				{
					$addToSet: {
						FavoriteMovies: MovieID,
					},
				},
				{ new: true }
			)
				.then(updatedUser => res.json(updatedUser))
				.catch(err => displayErrorMsg(err));
		}
	);

	/**
	 * @swagger
	 * /users/:Username/movies/:MovieID:
	 *   delete:
	 *     summary: Remove a movie from the user's favorite list by movie ID.
	 *     description: Remove a movie from the user's favorite list by movie ID.
	 *     parameters:
	 *       - in: path
	 *         name: Username
	 *         required: true
	 *         description: user's username
	 *         schema:
	 *          $ref: '#/components/schemas/User/properties/Username'
	 *       - in: path
	 *         name: MovieID
	 *         required: true
	 *         description: ID of movie to be added to favorites list
	 *         schema:
	 *           $ref: '#/components/schemas/Movie/properties/_id'
	 *     responses:
	 *       200:
	 *         description: Remove a movie from the user's favorite list by movie ID.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 */
	//Remove a title from user's favorites list
	router.delete(
		'/users/:Username/movies/:MovieID',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			const { Username, MovieID } = req.params;
			Users.findOneAndUpdate(
				{ Username },
				{
					$pull: {
						FavoriteMovies: MovieID,
					},
				},
				{ new: true }
			)
				.then(updatedUser => res.json(updatedUser))
				.catch(err => displayErrorMsg(err));
		}
	);

	/**
	 * @swagger
	 * /users/:Username:
	 *   delete:
	 *     summary: Delete a user account by username
	 *     description: Delete a user account by username
	 *     parameters:
	 *       - in: path
	 *         name: Username
	 *         required: true
	 *         description: user's username
	 *         schema:
	 *          $ref: '#/components/schemas/User/properties/Username'
	 *     responses:
	 *       200:
	 *         description: Delete a user account by username
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: string
	 *               example: Username was deleted
	 */
	//Delete user account by username
	router.delete(
		'/users/:Username',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			const { Username } = req.params;
			Users.findOneAndRemove({ Username })
				.then(user => {
					user
						? res.status(200).send(`${Username} was deleted.`)
						: res.status(400).send(`${Username} was not found.`);
				})
				.catch(err => displayErrorMsg(err));
		}
	);
};
