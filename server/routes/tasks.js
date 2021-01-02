const express = require("express");

const router = express.Router()

router.get("/all:since?" , (req, res, next) => {
    const since = req.query.since;

    console.log(since)
    next();
})

router.post("/addupdatetask", (req, res, next) => {
    
})

module.exports = router