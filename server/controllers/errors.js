class CustomError extends Error {
    constructor(message, statusCode = 500, errorCode = "ERR-0") {
        super()
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}

const handleErrors = (err, req, res, next) => {
    if(err instanceof CustomError){
        const { message, errorCode, statusCode } = err;
        return res.status(statusCode).json({
            errorCode,
            message,
        })  
    }
    res.status(500).json({
        err
    })
}

module.exports = {
    CustomError,
    handleErrors
};
