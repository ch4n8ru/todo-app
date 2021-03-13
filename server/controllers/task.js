const mongoose = require("mongoose");
const { Project } = require("../models/project");
const { Task } = require("../models/task")
const { CustomError } = require("./errors");

exports.getAllTasksController = async (req, res, next) => {
    let since = req.query.since;
    let before = req.query.before;
    let query = {};
    let pagedata;

    if (since != undefined) {
        const pagesize = 30;
        currentDate = new Date()
        // zero out the hours
        currentDate.setHours(0, 0, 0, 0);
        const endTs = new Date(currentDate).setDate(new Date(currentDate).getDate() - pagesize);
        pagedata = {
            start:currentDate.getTime(),
            end:endTs
        }
        query = {
            at: {
                $gte: endTs
            }
        }
    }
    else if(before){
        const pagesize = 10;
        beforeDate = new Date(parseInt(before));
        beforeDate.setHours(0,0,0,0);
        const endTs = new Date(beforeDate).setDate(new Date(beforeDate).getDate() - pagesize);
        pagedata = {
            start:beforeDate.getTime(),
            end:endTs
        }
        query = {
            at: {
                $gte: endTs
            }
        }
    }

    
    try{
        let tasks = await Task.find(query).exec();
        res.json({ pagedata, tasks })
    }
    catch(err){
        return next(new CustomError(err.message))
    }

}

exports.addnewtaskController = async (req, res, next) => {

    const { userid, projectname, projectdescription, description, start, end } = req.body;
    let { projectid } = req.body;
    if (!projectid && projectname) {
        const newProject = new Project({
            projectname,
            projectdescription,
            userid
        })

        projectid = await newProject.save().then(project => project._id)
    }

    const newTask = new Task({
        userid,
        projectid,
        description,
        start,
        end
    })

    try {
        await newTask.save();
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
        updatedTask = await Task.findOneAndUpdate(filter, { projectid, description, start, end }, options)
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



