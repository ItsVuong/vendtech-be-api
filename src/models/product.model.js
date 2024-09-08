const ImageSchema = require('./Image.Schema');
const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Require product name."]
        },

        image:[{
            type: ImageSchema,
            required: [true, "Require product image."]
        }],

        category:{
            type: mongoose.Types.ObjectId,
            ref: "Category" 
        },

        description:{
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;