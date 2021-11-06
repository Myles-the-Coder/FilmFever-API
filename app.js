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

// const localhost = 'mongodb://localhost:27017/filmfeverDB'

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

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

app.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', '*')
  res.header('Cross-Origin-Resource-Policy', 'cross-origin')
  res.header('Cross-Origin-Embedder-Policy', 'require-corp')
  res.header('Cross-Origin-Opener-Policy', 'same-origin')
  next()
})

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
