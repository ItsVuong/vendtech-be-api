const Category = require('../models/category.model');

async function createCategory(data){
    const category = new Category({name: data.name});
    return await category.save();
}

async function getCategoryById(id){
    return Category.findById(id);
}

async function getCategories(pageSize, currentPage){
    const count = await Category.countDocuments({});
    const divide = Number(count/pageSize);
    const pages = Math.round(divide);

    if(currentPage >= pages){currentPage = pages}
    if(currentPage <= 0){currentPage = 1}
    const categories = Category.find({}, null, 
        { limit: pageSize, skip: (currentPage - 1) * pageSize });

    return {
        data: categories,
        total: count
    };
}

async function updateCategory(id, data){
    const category = { name: data.name };
    return Category.findByIdAndUpdate(id, category, {returnDocument: "after"});
}

async function deleteCategory(id){
    return Category.findByIdAndDelete(id)
}

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    getCategoryById,
    deleteCategory
}