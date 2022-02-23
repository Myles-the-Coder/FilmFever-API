import { check, validationResult } from 'express-validator';

/**
 * This function displays an error message upon HTTPS error
 * @param {string} err 
 */
export const displayErrorMsg = (err) => {
	console.error(err);
	res.status(500).send(`Error: ${err}`);
}

/**
 * This function finds a database collection and returns a JSON object
 * @param {object} model 
 * @param {JSON} res 
 */
export const resJSON = (model, res) => {
  model.find().then(data => res.json(data))
}
/**
 * This function checks user inputs
 * Username and password must not be empty and must be a minimum length of 5 characters
 * Email should be in proper format
 * @returns boolean values
 */
export const validateInputs = () => {
	return [
		check('Username', 'Username is required').notEmpty().isLength({ min: 5 }),
		check('Password', 'Password is required').notEmpty().isLength({min: 5}),
		check('Email', 'Email does not appear to be valid.').normalizeEmail().isEmail(),
	];
}

/**
 * Finds the validation errors in this request and wraps them in an object with handy functions
 */
export const checkValidationObject = (req, res) => {
  let errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(422).json({ errors: errors.array() });
}