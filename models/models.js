import pkg from 'mongoose';
const { Schema, model } = pkg;
import bcrypt from 'bcrypt';
import m2s from 'mongoose-to-swagger'

let movieSchema = Schema({
	Title: { type: String, required: true },
	Description: { type: String, required: true },
	Genre: {
		Name: String,
		Description: String,
	},
	Director: {
		Name: String,
		Bio: String,
	},
	ImagePath: String,
	Featured: Boolean,
});

let userSchema = Schema({
	Username: { type: String, required: true },
	Password: { type: String, required: true },
	Email: { type: String, required: true },
	Birthday: Date,
	FavoriteMovies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
});

/**
 * This function hashes the user's password
 * @param {string} password 
 * @returns Hashed password
 */
userSchema.statics.hashPassword = function(password) {
  return bcrypt.hashSync(password, 10);
};
/**
 * This function compares the user's password with the hashed password in the database
 * @param {string} password 
 * @returns boolean value
 */
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};


let directorSchema = Schema({
	Name: { type: String, required: true },
	Bio: { type: String, required: true },
	Birthdate: { type: Date, required: true },
	Deathdate: { type: Date },
});

let genreSchema = Schema({
	Name: { type: String, required: true },
	Description: { type: String, required: true },
});

export let Movie = model('Movie', movieSchema);
export let User = model('User', userSchema);
export let Director = model('Director', directorSchema);
export let Genre = model('Genre', genreSchema);
let swaggerSchemas = {
  Movie: m2s(Movie),
  User: m2s(User),
  Genre: m2s(Genre),
  Director: m2s(Director)
}

console.log(swaggerSchemas)