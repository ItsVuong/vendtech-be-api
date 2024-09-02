const ImageSchema = require('./Image.Schema');
const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required."]
        },
        description: {
            type: String,
            required: [true, "Category description is required."]
        },
        image:{
            type: ImageSchema,
            required: [true, "Image is required."]
        },
    },
    {
        timestamps: true
    }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;