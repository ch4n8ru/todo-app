const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userid: mongoose.Types.ObjectId,
    projectid: mongoose.Types.ObjectId,
    description: { type: String, required: true },
    start: {
        type: Number,
        required:true
    },
    end: {
        type: Number,
        required:false
    },
    at: {
        type: Number,
        default: function() {
            let start = new Date(this.start);
            start.setHours(0,0,0,0);
            return start.getTime();
        }
    },
    duration: {
        type: Number,
        default: function (model) {
            if (this.start && this.end)
                return Math.floor((this.end.getTime() - this.start.getTime()) / 1000)
            else
                return 0
        }
    }
})

exports.Task = mongoose.model("Tasks", taskSchema)