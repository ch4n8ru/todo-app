class CustomError extends Error {
    constructor(message, statusCode = 500, name = "Error", errorCode = "ERR-0") {
        super()
        this.message = message;
        this.name = name;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}

const handleErrors = (err, req, res, next) => {
    if(err instanceof CustomError){
        const { message, name, errorCode, statusCode } = err;
        return res.status(statusCode).json({
            name,
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
