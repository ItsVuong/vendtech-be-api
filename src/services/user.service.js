const { HttpException } = require("../exceptions/exception");
const User = require("../models/user.model")
const PasswordResetToken = require("../models/password-reset-token")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

async function getUserByEmail(email){
    return User.findOne({ email: email });
}

async function getByUsername(username){
    const user = await User.findOne({ username: username });
    return user;
}

async function getAllUsers(pageSize, currentPage){
    const count = await User.countDocuments({});
    const divide = Number(count/pageSize);
    const pages = Math.round(divide);

    if(currentPage >= pages){currentPage = pages}
    if(currentPage <= 0){currentPage = 1}
    const users = await User.find({}, null, 
        { limit: pageSize, skip: (currentPage - 1) * pageSize });

    return {
        data: users,
        total: count
    };
}

async function createUser(data){
    const {username, password, email} = data;
    if(await getByUsername(username)){
        throw new HttpException(400, "Username already exists.")
    }
    if(await getUserByEmail(email)){
        throw new HttpException(400, "Email already exists.")
    }
    const user = new User({
        username: username,
        password: password,
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
            expiresIn: "31d"
        }
    );
    return {...user.toJSON(), accessToken}
}

async function updateUser(id, updateData){
    const user = await User.findOne({_id: id});
    const {confirmPassword, newPassword, newUsername} = updateData;
    const isPasswordValid = await bcrypt.compare(confirmPassword, user.password); 

    if(!isPasswordValid){
        throw new HttpException(400, "Old password does not match.");
    }
    if(newUsername && await getByUsername(newUsername)){
        throw new HttpException(400, "Username already exists.");
    }

    const update = {};
    if(newPassword) update.password = newPassword;
    if(newUsername) update.username = newUsername;
    const updateUser = await User.findOneAndUpdate(
        {_id: id}, 
        update, 
        {returnDocument: "after"});
    return updateUser;
}

async function generatePasswordToken(userId) {
    const tokenSecret = crypto.randomBytes(32).toString('hex');
    // const hash = await bcrypt.hash(tokenSecret, 10);
    let resetToken = await PasswordResetToken.findOneAndUpdate({ userId: userId }, { token: tokenSecret });
    if (!resetToken) {
        resetToken = await new PasswordResetToken({
            userId: userId,
            token: tokenSecret
        }).save();
    }
    const link = `${process.env.CLIENT_URL}/reset-password?token=${tokenSecret}&id=${userId}`;
    return link;
}   

async function resetPassword(userId, password, token){
    const resetToken = await PasswordResetToken.findOne({userId: userId})
    if(!resetToken){
        throw new HttpException(400, "Token is invalid or expired.");
    }
    const isValid = await bcrypt.compare(String(token), String(resetToken.token));
    if(!isValid){
        throw new HttpException(400, "Token is invalid or expired.")
    }

    const user = await User.findOneAndUpdate({_id: userId}, {password: password});
    console.log(user)
    if(user) {await PasswordResetToken.deleteOne({userId: userId})}
    return true;
}

module.exports = {
    createUser,
    authenticateUser,
    getByUsername,
    getUserByEmail,
    generatePasswordToken,
    resetPassword,
    updateUser,
    getAllUsers
}
