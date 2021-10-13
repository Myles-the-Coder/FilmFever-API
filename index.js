import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();
let movies = [
	{
		title: 'The Godfather',
    releaseYear: '1972',
    genre: ['Crime', 'Drama'],
		director: 'Francis Ford Coppola',
	},
	{
		title: 'The Shawshank Redemption',
    releaseYear: '1994',
    genre: 'Drama',
		director: 'Frank Darabont'
	},
	{
		title: 'Raging Bull',
    releaseYear: '1980',
    genre: ['Biography', 'Drama', 'Sport'],
		director: 'Martin Scorsese',
	},
  {
		title: 'Citizen Kane',
    releaseYear: '1941',
    genre: ['Drama','Mystery'],
		director: 'Orson Welles'
	},
  {
    title: 'One Flew Over the Cuckoo\'s Nest',
    releaseYear: '1975',
    genre: 'Drama',
		director: 'Milos Forman'
	},
  {
    title: 'Psycho',
    releaseYear: '1960',
    genre: ['Horror', 'Mystery', 'Thriller'],
		director: 'Alfred Hitchcock'
	},
  {
		title: 'On the Waterfront',
    releaseYear: '1954',
    genre: ['Crime', 'Drama', 'Thiller'],
		director: 'Elia Kazan'
	},
  {
		title: '2001: A Space Odyssey',
    releaseYear: '1968',
    genre: ['Adventure', 'Sci-Fi'],
		director: 'Stanley Kubrick'
	},
  {
		title: 'Sunset Blvd.',
    releaseYear: '1950',
    genre: ['Drama', 'Film-Noir'],
		director: 'Billy Wilder'
	},
  {
		title: 'Apocalypse Now',
    releaseYear: '1979',
    genre: ['Drama', 'Mystery', 'War'],
		director: 'Frank Darabont'
	},
];

app.use(morgan('common'))
app.use(express.static('public'))

app.get('/', (req, res) => res.send('Welcome to FilmFever!'));
app.get('/movies', (req, res) => res.json(movies));

app.use((req, res, err, next) => {
  if(err) { 
    console.error(err.stack)
    res.status(500).send('Something broke!')
  }
  next()
})

app.listen(3000, () => console.log('Your app is running on Port 3000'));
