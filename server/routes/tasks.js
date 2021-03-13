const express = require("express");
const { addnewtaskController, updateTaskController, getAllTasksController } = require("../controllers/task");

const router = express.Router()

router.get("/all:since?" , getAllTasksController)

router.post("/addnewtask", addnewtaskController)

router.post("/updatetask", updateTaskController)

module.exports = router