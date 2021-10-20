import mongoose from 'mongoose';

const movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
    BirthYear: Date
  },
  ImagePath: String,
  Featured: Boolean
})

const genreSchema = mongoose.Schema({
  Name: {type: String, required: true},
  Description: String
})

const directorSchema = mongoose.Schema({
  Name: {type: String, required: true},
  Bio: String,
  BirthYear: Date
})

const userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  Favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
})

let Movie = mongoose.model('Movie', movieSchema)
let Genre = mongoose.model('Genre', genreSchema)
let Director = mongoose.model('Director', directorSchema)
let User = mongoose.model('User', userSchema)

export {Movie, Genre, Director, User}