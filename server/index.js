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

app.use((err , req , res , next) => {
    res.status = 500;
    res.send({
        err,
        message: "Something broke"
    })
})

mongoose.connect(process.env.MONGO_URI , {dbName: "todoapp" ,useNewUrlParser:true , useUnifiedTopology:true});

mongoose.connection.on('open' , () => {
    app.listen(process.env.APP_PORT, () => {
        console.log(`App started; listening on port ${process.env.APP_PORT}`) 
    });
})

mongoose.connection.on('error' , (err) => {
    console.log('Could not connect to database ' + err)
})