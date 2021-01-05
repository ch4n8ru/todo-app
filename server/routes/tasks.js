const express = require("express");
const { addnewtaskController, updateTaskController } = require("../controllers/task");

const router = express.Router()

router.get("/all:since?" , (req, res, next) => {
    const since = req.query.since;

    console.log(since)
    next();
})

router.post("/addnewtask", addnewtaskController)

router.post("/updatetask", updateTaskController)

module.exports = router