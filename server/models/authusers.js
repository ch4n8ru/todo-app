const mongoose = require('mongoose');

const sessions = new mongoose.Schema({
    createdAt: { type: Date, expires: "4800m", default: Date.now },
    userid: {
        type: mongoose.Types.ObjectId
    },
    refreshedAt: Date,
    accessToken: String,
    refreshToken: String,
    grantedAt: Date,
    host: String,
    userAgent: String,
})

exports.UserSessions = new mongoose.model('UserSessions', sessions)

