function errorMiddleware(error, req, res, next){
    const status = error.status ? error.status : 500;
    const message = status === 500 ? "Something went wrong, please try again later." : error.message;
    const errors = error.error;
    res.status(status).send({ status, message })
}

module.exports = errorMiddleware