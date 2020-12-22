const { CustomError } = require("./errors");

const jwt = require('jsonwebtoken');
const { userModel } = require("../models/user");

exports.authChecker = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || authHeader.split(' ')[0] !== "Bearer"){
        return next(new CustomError("No Authorization details sent",401, "ERR-AUTH"))
    }

    const authToken = authHeader.split(' ')[1];

    try{
        const tokenData = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, { complete:true })

        const userid = tokenData.payload.userid;
        
        const foundUser = await userModel.findOne({_id:userid}).exec();

        if(!foundUser)
            throw new Error()

        req.body.user = userid;

        next();
    }
    catch(err){
        next(new CustomError("Invalid User",401,"ERR-AUTH"))
    }
}