const { HttpException } = require("../exceptions/exception");
const { validateUser, validateUserAuthenticate } = require("../utils/request-validator");
const userService = require('../services/user.service');
const sendEmail = require('../utils/email-sender')

async function createUser(req, res, next){
    try {
        const user = req.body;
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

async function getUserByUsername(req, res, next) {
    try {
        const username = params.username;
        if (!username){
            throw HttpException(400, "Username cannot be empty.");
        }
        const user = userService.getByUsername(username);
        if (!user){
            throw HttpException(400, "User not found.");
        }
        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function getPasswordResetToken(req, res, next) {
    try {
        const email = req.params.email;
        console.log(req.params)
        if (!email) {
            throw new HttpException(400, "Email cannot be empty.");
        }
        const user = await userService.getUserByEmail(email);
        if (!user) {
            throw HttpException(400, "Email does not exist.")
        }
        console.log(user)
        const redirectUrl = await userService.generatePasswordToken(user._id);

        const data = await sendEmail(email, "Reset password", "<h1>Click here to reset password: </h1><br><a href='" + redirectUrl + "'>"+ redirectUrl +"</a>")
        res.status(200).send(redirectUrl);
    } catch (error) {
       console.log(error);
       next(error); 
    }
}

async function resetPassword(req, res, next){
    try {
        const {password, token, userId} = req.body;
        if(!password || !token || ! userId){
            throw new HttpException(400, "Request has missing fields.")
        }
        const result = await userService.resetPassword(userId, password, token);
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    createUser,
    authenticateUser,
    getPasswordResetToken,
    resetPassword
}