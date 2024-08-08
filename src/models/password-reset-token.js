const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt")

const PasswordResetTokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        require: true,
        unique: true,
        ref: "User"
    },
    token: {
        type: String,
        require: true
    },
    createdAt: { type: Date, default: Date.now(), expires: 900 }
});

//Hash token before saving
PasswordResetTokenSchema.pre("save", async function (next){
    if(!this.isModified("token")){
        return next();
    }
    const hash = await bcrypt.hash(this.token, 10);
    this.token = hash;
    next();
});

PasswordResetTokenSchema.pre("findOneAndUpdate", async function (next){
    if(!this._update.token){
        return next();
    }
    const hash = await bcrypt.hash(this._update.token, 10);
    this._update.token = hash;
    next();
});


const PasswordResetTokenModel = mongoose.model("PasswordResetToken", PasswordResetTokenSchema);

module.exports = PasswordResetTokenModel;