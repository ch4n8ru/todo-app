const mongoose = require("mongoose");
const { Task } = require("../models/task")
const { CustomError } = require("./errors");


exports.addnewtaskController = async (req, res, next) => {

    const { userid, projectid, description, at, start, end } = req.body;

    const newTask = new Task({
        userid,
        projectid,
        description,
        at,
        start,
        end
    })

    try {
        await newTask.save()
    }

    catch (err) {
        return next(new CustomError(err.message))
    }

    res.status(200).json({
        "success": true
    })
}

exports.updateTaskController = async (req, res, next) => {

    const options = {
        new: true,
        setDefaultsOnInsert: true
    }

    const { taskid, userid, projectid, description, at, start, end } = req.body;

    let updatedTask;

    try {
        const filter = { "_id": mongoose.Types.ObjectId(taskid), userid }
        updatedTask = await Task.findOneAndUpdate(filter, { projectid, description, at, start, end }, options)
    }

    catch (err) {
        return next(new CustomError(err.message))
    }

    if (updatedTask) {
        res.status(200).json({
            "success": true
        })
    }
    else {
        res.status(500).json({
            "success": false
        })
    }
}



