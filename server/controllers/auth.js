const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { userModel } = require('../models/user');
const { CustomError } = require('./errors');

exports.loginController = async (req, res, next) => {
    const { email, password } = req.body;
    const foundUser = await userModel.findOne({ email: email }).exec();
    console.log('found', foundUser);
    next();
}

exports.signupController = async (req, res, next) => {
    const { email, name, password } = req.body;
    let hashedPassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        {
            next(new CustomError(errors.array()[0].msg, 422))
            // break out of callback after propogating error
            return
        }
    }
    try {
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ email: email, name: name, password: hashedPassword });
        await newUser.save();
        res.status = 200;
        res.send({ success: true })
    }
    catch (err) {
        res.status = 500;
        res.send({ success: false })
    }

}