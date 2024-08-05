
const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required."]
        },
    },
    {
        timestamps: true
    }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;