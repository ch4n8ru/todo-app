const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email:String,
    name:String,
    password:String,
    createdAt:{
        type:Date,
        default: new Date()
    }
});

exports.userModel = mongoose.model('Users' , userSchema);