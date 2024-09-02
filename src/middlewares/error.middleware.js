function errorMiddleware(error, req, res, next){
    const status = error.status ? error.status : 500;
    const message = status === 500 ? "Something went wrong, please try again later." : error.message;
    const errors = error.error;
    console.log(error);
    res.status(status).send({ timeStamp: Date(), status, message, errors })
}

module.exports = errorMiddleware