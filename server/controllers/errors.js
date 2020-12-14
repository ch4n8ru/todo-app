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
    const { message, name, errorCode, statusCode } = err;
    res.status(statusCode).json({
        name,
        errorCode,
        message,
    })
}

module.exports = {
    CustomError,
    handleErrors
};
