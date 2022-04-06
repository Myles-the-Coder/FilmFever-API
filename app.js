'use strict';
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import routes from './routes/routes.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Express API for FilmFever',
		version: '1.0.0',
		description:
			'This is a RESTful API made with Express and Node.js. It retrieves data from a MongoDB database',
		license: {
			name: 'Licensed under MIT',
			url: 'https://github.com/Myles-the-Coder/FilmFever-API/blob/main/LICENSE',
		},
		contact: {
			name: 'Myles Jefferson',
			url: 'https://www.mylesjefferson.com/',
		},
	},
	servers: [
		{
			url: 'http://localhost:8080',
			description: 'Development server',
		},
	],
};

const options = {
	swaggerDefinition,
	apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

dotenv.config();
const app = express();

let allowedOrigins = [
	'http://localhost:8080',
	'http://testsite.com',
	'http://localhost:1234',
	'http://localhost:4200',
	'https://filmfever.netlify.app',
	'https://film-fever-api.herokuapp.com',
	'https://myles-the-coder.github.io',
];

app.use(
	cors({
		/**
		 * This function checks allowedOrigins to allow CORS
		 * @param {string} origin
		 * @param {function} callback
		 * @returns callback function with boolean value
		 */
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

//Connects to database
mongoose
	.connect(process.env.CONNECTION_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(res => console.log('DB Connected!'))
	.catch(err => console.log(err, err.message));

app.use(passport.initialize());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(`public`));
app.use(morgan('common'));

auth(app);
import './authentication/passport.js';

routes(app);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((req, res, err, next) => {
	if (err) {
		console.error(err.stack);
		res.status(500).send('Something broke!');
	}
	res.setTimeout(200);
	next();
});

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => console.log(`Listening on Port ${port}`));
