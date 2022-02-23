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
*                        type: object
*                        properties:
*                         Title:
*                          type: string
*                          description: Movie title
*                          example: The Godfather
*                         Description:
*                          type: string
*                          description: Movie description
*                          example: The Godfather came out in 1972...
*                         Genre:
*                          type: object
*                          properties:
*                           Name:
*                            type: string
*                            example: Drama
*                           Description:
*                            type: string
*                            example: Drama is a genre characterized by...
*                         Director:
*                           type: object
*                           properties:
*                            Name:
*                             type: string
*                             example: Francis Ford Coppola
*                            Bio:
*                             type: string
*                             example: Francis Ford Coppola was born...
*                         ImagePath:
*                           type: string
*                           example: https://th.bing.com/th/id/OIP.EkDaV-ETeaVe1TfXGfPL0AHaLH?pid=ImgDet&rs=1
*                         Featured:
*                           type: boolean
*                         
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
*                  Title:
*                   type: string
*                   description: Movie title
*                   example: The Godfather
*                  Description:
*                   type: string
*                   description: Movie description
*                   example: The Godfather came out in 1972...
*                  Genre:
*                   type: object
*                   properties:
*                    Name:
*                     type: string
*                     example: Drama
*                    Description:
*                     type: string
*                     example: Drama is a genre characterized by...
*                  Director:
*                    type: object
*                    properties:
*                     Name:
*                      type: string
*                      example: Francis Ford Coppola
*                     Bio:
*                      type: string
*                      example: Francis Ford Coppola was born...
*                  ImagePath:
*                    type: string
*                    example: https://th.bing.com/th/id/OIP.EkDaV-ETeaVe1TfXGfPL0AHaLH?pid=ImgDet&rs=1
*                  Featured:
*                    type: boolean
*                  
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
*             type: object
*             properties:
*                 Name:
*                  type: string
*                  example: Drama
*                 Description:
*                   type: string
*                   example: Drama is a genre characterized by...
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
*    responses: 
*      200:
*       description: A JSON object holding data about a single genre by name
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*                 Name:
*                  type: string
*                  example: Drama
*                 Description:
*                   type: string
*                   example: Drama is a genre characterized by...
*/
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
/**
* @swagger
* /directors/:Name:
*   get:
*    summary: A JSON object holding data about a single director by name
*    responses: 
*      200:
*       description: A JSON object holding data about a single director by name
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*                 Name:
*                  type: string
*                  example: ALfred Hitchcock
*                 Bio:
*                   type: string
*                   example: Alfred Hitchcock was an English film director...
*                 Birthdate:
*                   type: string
*                   example: 1939-04-07T07:00:00.000+00:00
*                   format: date-time
*                 Deathdate:
*                   type: string
*                   example: 980-04-29T06:00:00.000+00:00
*                   format: date-time
*/
	router.get(
		'/directors/:Name',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			Directors.findOne({ Name: req.params.Name })
				.then(director => res.json(director))
				.catch(err => displayErrorMsg(err));
		}
	);

	//Validate user inputs and, if valid, add user to database
 /**
* @swagger
* /users/{id}:
*   get:
*     summary: Retrieve a single JSONPlaceholder user.
*     description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
*     responses:
*       200:
*         description: A single user.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: object
*                   properties:
*                     id:
*                       type: integer
*                       description: The user ID.
*                       example: 0
*                     name:
*                       type: string
*                       description: The user's name.
*                       example: Leanne Graham
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
	router.get(
		'/users/:Username',
		passport.authenticate('jwt', { session: false }),
		(req, res) => {
			Users.findOne({ Username: req.params.Username })
				.then(user => res.json(user))
				.catch(err => displayErrorMsg(err));
		}
	);

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
