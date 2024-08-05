
const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Require product name."]
        },
    },
    {
        timestamps: true
    }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;