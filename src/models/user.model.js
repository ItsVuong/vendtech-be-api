const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required."],
            unique: true
        },

        password:{
            type: String,
            required: [true, "Password is required."]
        },

        email:{
            type: String,
            required: [true, "Emai is required."],
            unique: true
        },
    },
    {
        timestamps: true
    }
);

UserSchema.pre("save", async function (next){
    console.log("middlware: ", this)
    if(!this.isModified("password")){
        return next();
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

UserSchema.pre("findOneAndUpdate", async function (next){
    if(!this._update.password){
        return next();
    }
    const hash = await bcrypt.hash(this._update.password, 10);
    this._update.password = hash;
    next();
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;