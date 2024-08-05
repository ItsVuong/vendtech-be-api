const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
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

const ProductModel = mongoose.model("User", ProductSchema);

module.exports = ProductModel;