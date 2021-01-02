const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userid: mongoose.Types.ObjectId,
    projectid: mongoose.Types.ObjectId,
    description: String,
    at: {
        type: Date,
        default: new Date()
    },
    start: {
        type: Date
    },
    end: {
        type: Date
    },
    duration: {
        type: Number,
        default: () => {
            if (this.start && this.end)
                return Math.floor((this.end.getTime - this.start.getTime) / 1000)
            else
                return 0
        }
    }
})

exports.taskModel = mongoose.model("Tasks",taskSchema)