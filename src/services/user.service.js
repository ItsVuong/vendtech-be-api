const { HttpException } = require("../exceptions/exception");
const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function isUserEmailExists(email){
    return User.findOne({ email: email });
}

async function isUsernameExists(username){
    return User.findOne({ username: username });
}

async function createUser(data){
    const {username, password, email} = data;
    if(await isUsernameExists(username)){
        const error = new Error();
        error.status = 400;
        error.message = "Bad request";
        error.error = {username: "Username already exists."}
        throw error;
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username: username,
        password: hashPassword,
        email: email
    });

    return await await user.save();
}

async function authenticateUser(data){
    const { username, password } = data;
    const user = await User.findOne({ username: username });
    if(!user){
        throw new HttpException(400, "User already exists");
    }
    const validatePassword = await bcrypt.compare(password, user.password)
    if(!validatePassword){
        throw new HttpException(400, "Invalid password")
    }
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
    const accessToken = jwt.sign(
        {username: username, email: user.email, id: user._id},
        accessTokenSecret,
        {
            expiresIn: "1h"
        }
    );
    return {...user.toJSON(), accessToken}
}

module.exports = {
    createUser,
    authenticateUser
}
