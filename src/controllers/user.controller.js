const { HttpException } = require("../exceptions/exception");
const { validateUser, validateUserAuthenticate } = require("../utils/request-validator");
const userService = require('../services/user.service');
const sendEmail = require('../utils/email-sender')
const jwt = require("jsonwebtoken");
const querystring = require("querystring");

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

async function getUsers(req, res, next){
    try {
        const regex = /^\d+$/
        if(!req.query.pageSize || !regex.test(req.query.pageSize)){
            throw new HttpException(400, "Invalid page size");
        }

        const result = await userService.getAllUsers(req.query.pageSize, req.query.currentPage);
        return res.status(200).send(result)
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
        const username = req.params.username;
        if (!username){
            throw new HttpException(400, "Username cannot be empty.");
        }
        const user = await userService.getByUsername(username);
        if (!user){
            throw new HttpException(400, "User not found.");
        }
        const {password, ...response} = user.toJSON()
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function getPasswordResetToken(req, res, next) {
    try {
        const email = req.params.email;
        if (!email) {
            throw new HttpException(400, "Email cannot be empty.");
        }
        const user = await userService.getUserByEmail(email);
        if (!user) {
            throw new HttpException(400, "Email does not exist.")
        }
        const redirectUrl = await userService.generatePasswordToken(user._id);
        const data = await sendEmail(email, "Reset password",
        `<!DOCTYPE html>
        <html>
        <body>
            <h4>Click here to reset your password: </h4>
            <a href="http://${encodeURIComponent(redirectUrl)}"> RESET PASSWORD </a>
        </body>    
        </html>`
        )
        res.status(200).send(data);
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

async function updateUser(req, res, next){
    try {
        const {confirmPassword, newUsername, newPassword} = req.body;
        if(!newUsername?.trim() && !newPassword?.trim()){
            throw new HttpException(400, "Please provide new username or new password.");
        }
        if(!confirmPassword?.trim()){
            throw new HttpException(400, "Please provive your old password.");
        }
        const authorization = jwt.decode(req.headers['authorization']);
        const {id} = authorization;
        const result = await userService.updateUser(id, req.body);
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    createUser,
    authenticateUser,
    getPasswordResetToken,
    resetPassword,
    getUserByUsername,
    updateUser,
    getUsers
}