const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { userModel } = require('../models/user');

exports.loginController = async (req, res, next) => {
    const { email, password } = req.body;
    const foundUser = await userModel.findOne({ email: email }).exec();
    console.log('found', foundUser);
    next();
}

exports.signupController = async (req, res, next) => {
    const { emailid, password } = req.body;
    let hashedPassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        {
            next(new Error('Validation failed'))
            // break out of callback after propogating error
            return
        }
    }
    try {
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ email: emailid, name: 'test', password: hashedPassword });
        await newUser.save();
        res.status = 200;
        res.send({ success: true })
    }
    catch (err) {
        res.status = 500;
        res.send({ success: false })
        console.log(err)
    }

}