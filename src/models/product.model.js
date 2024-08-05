const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    name: String,
    type: String,
    url: String,
  });

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Require product name."]
        },

        image:{
            type: ImageSchema,
            required: [true, "Required prodcuct image."]
        },

        category:{
            type: String,
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