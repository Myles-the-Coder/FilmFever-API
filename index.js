import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();

let movies = [
	{
		title: 'The Godfather',
		releaseYear: 1972,
		genre: ['Crime', 'Drama'],
		director: 'Francis Ford Coppola',
	},
	{
		title: 'The Shawshank Redemption',
		releaseYear: 1994,
		genre: 'Drama',
		director: 'Frank Darabont',
	},
	{
		title: 'Raging Bull',
		releaseYear: 1980,
		genre: ['Biography', 'Drama', 'Sport'],
		director: 'Martin Scorsese',
	},
	{
		title: 'Citizen Kane',
		releaseYear: 1941,
		genre: ['Drama', 'Mystery'],
		director: 'Orson Welles',
	},
	{
		title: "One Flew Over the Cuckoo's Nest",
		releaseYear: 1975,
		genre: 'Drama',
		director: 'Milos Forman',
	},
	{
		title: 'Psycho',
		releaseYear: 1960,
		genre: ['Horror', 'Mystery', 'Thriller'],
		director: 'Alfred Hitchcock',
	},
	{
		title: 'On the Waterfront',
		releaseYear: 1954,
		genre: ['Crime', 'Drama', 'Thriller'],
		director: 'Elia Kazan',
	},
	{
		title: '2001: A Space Odyssey',
		releaseYear: 1968,
		genre: ['Adventure', 'Sci-Fi'],
		director: 'Stanley Kubrick',
	},
	{
		title: 'Sunset Blvd.',
		releaseYear: 1950,
		genre: ['Drama', 'Film-Noir'],
		director: 'Billy Wilder',
	},
	{
		title: 'Apocalypse Now',
		releaseYear: 1979,
		genre: ['Drama', 'Mystery', 'War'],
		director: 'Francis Ford Coppola',
	},
];

app.use(morgan('common'));
app.use(express.static(`public`));

//Express Methods
app.get('/', (req, res) => res.send('Welcome to FilmFever!'));
app.get('/movies', (req, res) => res.json(movies));
app.get('/movies/:title', (req, res) => {
	let movie = movies.find(movie => movie.title === req.params.title);

	if (!movie)
		res
			.status(404)
			.send(`Movie with the title${req.params.title} cannot be found`);

	if (movie) {
		res.json(movie);
	}
});
app.get('/genre/:genre', (req, res) => {
	res.send('Successful GET request displaying genre information');
});
app.get('/directors', (req, res) => {
	res.send('Successful GET request displaying list of directors in database');
});
app.get('/directors/:name', (req, res) => {
	res.send('Successful GET request displaying director information');
});
app.post('/signup', (req, res) => {
	res.send('Successful POST request adding user account');
});
app.get('/accounts/:id', (req, res) => {
	res.send('Successful GET request displaying user information');
});
app.put('/accounts/update/:id', (req, res) => {
	res.send('Successful PUT request updating user information');
});
app.post('/accounts/favorites/:id', (req, res) => {
	res.send('Successful POST request adding title to "favorites" list');
});
app.delete('/accounts/favorites/:id', (req, res) => {
	res.send('Successful DELETE request removing title from "favorites" list');
});
app.delete('/accounts/:id', (req, res) => {
	res.send('Successful DELETE request deactivating user account');
});

app.use((req, res, err, next) => {
	if (err) {
		console.error(err.stack);
		res.status(500).send('Something broke!');
	}
	next();
});

app.listen(3000, () => console.log('Your app is running on Port 3000'));
