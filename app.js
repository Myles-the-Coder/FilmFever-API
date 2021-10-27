'use strict';
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import routes from './routes/routes.js';

dotenv.config();

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
import './authentication/passport.js';

routes(app)

app.use((req, res, err, next) => {
	if (err) {
		console.error(err.stack);
		res.status(500).send('Something broke!');
	}
	next();
});

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => console.log(`Listening on Port ${port}`));
