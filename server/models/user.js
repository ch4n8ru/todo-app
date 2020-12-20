const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    auth: {
        required: false,
        sessions: [String],
        // for trusted devices verification
        devices: [String]
    }
});

exports.userModel = mongoose.model('Users', userSchema);