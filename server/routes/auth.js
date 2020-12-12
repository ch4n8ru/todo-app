const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const { loginController, signupController } = require('../controllers/auth');
const { userModel } = require('../models/user');

router.post('/login' , loginController);
router.post('/signup' , body('email').custom(email => {
    return userModel.findOne({email:email}).then(foundUser => {
        if(foundUser)
            return Promise.reject("Email ID already in use")
    })
}) , signupController) ;


module.exports = router