const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { userModel } = require('../models/user');
const { CustomError } = require('./errors');
const { UserSessions } = require('../models/authusers');



// Todo
// Invalidate user session
// Return only authToken as response and set refresh token as cookie
exports.loginController = async (req, res, next) => {
    const { email, password } = req.body;

    const foundUser = await userModel.findOne({ email: email }).exec();

    if (!foundUser) {
        next(new CustomError("User doesn't exist", 401,  "ERR-INV-USER"))
        return
    }

    try {
        const passwordCheck = await bcrypt.compare(password, foundUser.password);

        if (!passwordCheck) {
            throw new CustomError("Authentication failed", 401,"ERR_INV_CRED");
        }
        const token = jwt.sign(
            {
                email,
                userid: foundUser._id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_LIFE }
        );
        const refreshToken = jwt.sign(
            { userid: foundUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_LIFE }
        );
        const userSession = new UserSessions({
            userid: foundUser._id,
            refreshedAt: null,
            accessToken: token,
            refreshToken: refreshToken,
            grantedAt: new Date(),
            host: req.connection.remoteAddress,
        });

        const newSessionId = userSession._id;

        const oldSessions = foundUser.auth.sessions;

        const newSessions = [...oldSessions, newSessionId]

        foundUser.auth.sessions = newSessions;

        await foundUser.save()

        await userSession.save()

        res.status(200).cookie("AuthToken", token, { expires: new Date(Date.now + process.env.ACCESS_TOKEN_LIFE), httpOnly: true }).json({
            token,
            refreshToken
        })
    }
    catch (err) {
        next(err);
    }
}

exports.logoutController = async (req, res, next) => {
    const { token } = req.body;
    try {
        // todo search for session and delete it from db
        const foundSession = await UserSessions.findOne({ accessToken: token }).exec();
        const tokenValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
            complete: true,
            ignoreExpiration: true
        });
        const foundUser = await userModel.findOne({ _id: tokenValid.payload.userid }).exec();
        if (foundUser && foundSession) {
            let activeSessions = foundUser.auth.sessions
            activeSessions = activeSessions.filter(session => session !== String(foundSession._id));
            foundUser.auth.sessions = activeSessions
            await foundUser.save()
        }
    }
    catch (err) { 
        // console.log(err)
    }
    res.status(200).json({
        "success": true
    })
}

exports.refreshTokenController = async (req, res, next) => {
    const { token, refreshToken } = req.body;
    try {
        const tokenValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
            complete: true
        });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, {
            complete: true
        })

        const foundSession = await UserSessions.findOne({ accessToken: token, refreshToken: refreshToken, userid: tokenValid.payload.userid }).exec();
        const foundUser = await userModel.findOne({ _id: tokenValid.payload.userid }).exec();

        if (foundSession && foundUser) {
            activeSessions = foundUser.auth.sessions;
            const validSession = activeSessions.find(session => session === String(foundSession._id))

            if (!validSession)
                throw new Error()

            const newToken = jwt.sign(
                {
                    email: tokenValid.payload.email,
                    userid: foundUser._id,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_LIFE }
            );

            foundSession.accessToken = newToken;
            foundSession.refreshedAt = new Date(Date.now());

            await foundSession.save();

            res.status(201).cookie("AuthToken", newToken, { expires: new Date(Date.now + process.env.ACCESS_TOKEN_LIFE), httpOnly: true }).json({
                token: newToken,
                refreshToken
            })

        }
        else {
            throw new Error();
        }
    }
    catch (err) {
        next(new CustomError("Session Ended", 440, "ERR-INV-SESSION"))
    }
}

exports.signupController = async (req, res, next) => {
    const { email, name, password } = req.body;
    let hashedPassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        {
            next(new CustomError(errors.array()[0].msg, 422, "ERR-VAL"))
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