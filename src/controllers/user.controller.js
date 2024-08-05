const { HttpException } = require("../exceptions/exception");
const { validateUser, validateUserAuthenticate } = require("../utils/request-validator");
const userService = require('../services/user.service')

async function createUser(req, res, next){
    try {
        const {username, password, email} = req.body;
        const user = {
            username: username,
            password: password,
            email: email
        }
        const error = validateUser(user);
        if(Object.keys(error).length){
            throw new HttpException(400, "Bad request.", error)
        }

        const result = await userService.createUser(user);
        return res.status(201).send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function authenticateUser(req, res, next){
    try {
        const body = req.body;
        const error = validateUserAuthenticate(body);
        if(Object.keys(error).length){
            throw new HttpException(400, "Bad request.", error);
        }
        const authenticatedUser = await userService.authenticateUser({username: body.username, password: body.password});
        const {password, ...response} = authenticatedUser;
        return res.status(200).send(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    createUser,
    authenticateUser
}