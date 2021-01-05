const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userid: mongoose.Types.ObjectId,
    projectid: mongoose.Types.ObjectId,
    description: { type: String, required: true },
    at: {
        type: Date,
        default: new Date()
    },
    start: {
        type: Date,
        required:true
    },
    end: {
        type: Date,
        required:true
    },
    duration: {
        type: Number,
        default: function (model) {
            console.log(model)
            if (this.start && this.end)
                return Math.floor((this.end.getTime() - this.start.getTime()) / 1000)
            else
                return 0
        }
    }
})

exports.Task = mongoose.model("Tasks", taskSchema)