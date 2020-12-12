const mongoose = require('mongoose');

const authUsers = new mongoose.Schema({
    userid:{
        type:mongoose.Types.ObjectId
    },
    refreshedAt:Date,
    accessToken:String,
    refreshToken:String,
    grantedAt:Date,
    host:String
})

exports.UserSessions = new mongoose.model('UserSessions' , authUsers)

