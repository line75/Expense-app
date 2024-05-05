const validationResult = require('express-validator')

const validateUser = async function(req, res, next) {
    await check('name').notEmpty().withMessage('Name is required').run(req);
    await check('age').isInt().withMessage('Age must be an integer').run(req);
    await check('email').isEmail().withMessage('Invalid email address').run(req);
    await check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req);

    // Check if there is an error.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // if validation succeeded
    next();
};