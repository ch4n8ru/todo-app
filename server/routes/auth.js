const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const { loginController, signupController } = require('../controllers/auth');
const { userModel } = require('../models/user');

router.post('/login', loginController);
router.post('/signup', [
    body('email').custom(email => {
        return userModel.findOne({ email: email }).then(foundUser => {
            if (foundUser)
                return Promise.reject("Email ID already in use")
        })
    }),
    body('email').notEmpty().isEmail().withMessage("Provide a valid Email address"),
    body('name').notEmpty().withMessage('Please provide a name'),
    body('password').isLength({
        min: 8,
        max: 15
    }).withMessage('Password must be between 8-15 characters and must be alpahanumeric'),
    body('confirmpassword').custom((confirmpassword, { req }) => {
        if (confirmpassword != req.body.password)
            throw new Error('Passwords do not match')
        return true
    }),
    body('password').isStrongPassword({
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }).withMessage('Choose a strong password')
], signupController);


module.exports = router