const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email:String,
    name:String,
    password:String
});

exports.userModel = mongoose.model('User' , userSchema);