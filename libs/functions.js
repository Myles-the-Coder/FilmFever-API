import { check, validationResult } from 'express-validator';

export const displayErrorMsg = (err) => {
	console.error(err);
	res.status(500).send(`Error: ${err}`);
}

export const resJSON = (model, res) => model.find().then(data => res.json(data))

export const validateInputs = () => {
	return [
		check('Username', 'Username is required').isLength({ min: 5 }),
		check('Password', 'Password is required').notEmpty().isLength({min: 5}),
		check('Email', 'Email does not appear to be valid.').normalizeEmail().isEmail(),
	];
}

export const checkValidationObject = (req, res) => {
  let errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(422).json({ errors: errors.array() });
}