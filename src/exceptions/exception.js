class HttpException extends Error {
    constructor(status, message, error){
        super();
        this.status = status;
        this.message = message;
        this.error = error;
    }
}

module.exports = {
    HttpException: HttpException
}