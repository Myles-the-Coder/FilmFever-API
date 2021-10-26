import { check } from 'express-validator';

export function displayErrorMsg(err) {
	console.error(err);
	res.status(500).send(`Error: ${err}`);
}

export function resJSON(model, res) {
	return model.find().then(data => res.json(data));
}

export function validateInputs() {
	return [
		check('Username', 'Username is require').isLength({ min: 5 }),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear ot be valid.').isEmail(),
	];
}