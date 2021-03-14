const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    projectname:{
        type:String,
        required:true
    },
    projectdescription:{
        type:String,
        required:false
    },
    userid:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    at:Date,
    start:Date,
    end:Date
})

exports.Project = mongoose.model("Project" , projectSchema);