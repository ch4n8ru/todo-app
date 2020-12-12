const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const AuthRoutes = require('./routes/auth')


app.use(bodyParser.json());

app.use(cookieParser());

app.use('/auth' , AuthRoutes);

app.use('/' , (req , res , next) => {
    res.send({'m' : 'hello'})
})

mongoose.connect(process.env.MONGO_URI , {useNewUrlParser:true , useUnifiedTopology:true});

mongoose.connection.on('open' , () => {
    app.listen(process.env.APP_PORT, () => {
        console.log(`app started on ${process.env.APP_PORT}`) 
    });
})

mongoose.connection.on('error' , (err) => {
    console.log('Could not connect to database ' + err)
})