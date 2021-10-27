import { check, validationResult } from 'express-validator';

export function displayErrorMsg(err) {
	console.error(err);
	res.status(500).send(`Error: ${err}`);
}

export function resJSON(model, res) {
	return model.find().then(data => res.json(data));
}

export function validateInputs() {
	return [
		check('Username', 'Username is required').isLength({ min: 5 }),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear ot be valid.').isEmail(),
	];
}

export function checkValidationObject(req, res) {
  let errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(422).json({ errors: errors.array() });
}