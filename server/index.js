const express = require('express');
const app = express();
const path = require('path')
require('dotenv').config({ path: path.resolve(`.${process.env.NODE_ENV}.env`) });
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const AuthRoutes = require('./routes/auth');
const { handleErrors } = require('./controllers/errors');
const { authChecker } = require('./controllers/authcheck');


app.use(bodyParser.json());

app.use(cookieParser());

app.use('/auth', AuthRoutes);

app.use(authChecker, (req, res, next) => {
    res.json(req.body.user)
})

app.use(handleErrors);

try {
    mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
}
catch (err) {
    console.log("Couldnt connect to database " + err )
}

mongoose.connection.on('open', () => {
    app.listen(process.env.APP_PORT, () => {
        console.log(`App started; listening on port ${process.env.APP_PORT}`)
    });
})

mongoose.connection.on('error', (err) => {
    console.log('Could not connect to database ' + err)
})

module.exports = app