
const {check} = require("express-validator")
const validate = [
    check('user_name').not().isEmpty().withMessage('Name must have more than 5 characters'),
    check('email').isEmail().withMessage('Invalid Email'),
    check('password').isLength({ min: 6 }).withMessage('must be at least 5 chars long')
]

const loginValidate  = [
    check('email').isEmail().withMessage('Invalid Email'),
    check('password').isLength({ min: 6 }).withMessage('must be at least 5 chars long')
]
module.exports = validate