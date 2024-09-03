
const ImageSchema = require('./Image.Schema');
const mongoose = require('mongoose');

const FoodNDrinkSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required."]
        },

        image:{
            type: ImageSchema,
            required: [true, "Image is required."]
        },

        category:{
            type: mongoose.Types.ObjectId,
            ref: "food_drink_category",
            required: [true, "Categroy is required"] 
        },

        description:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const FoodAndDrinkModel = mongoose.model("food_drink", FoodNDrinkSchema);

module.exports = FoodAndDrinkModel;