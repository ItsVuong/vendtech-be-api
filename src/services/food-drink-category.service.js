
const { HttpException } = require('../exceptions/exception');
const Category = require('../models/food-drink-category.model');

async function createCategory(data){
    const category = new Category({name: data.name, description: data.description, image: data.image});
    return await category.save();
}

async function getCategoryById(id){
    return Category.findById(id);
}

async function getCategories(pageSize, currentPage){
    const count = await Category.countDocuments({});
    const divide = Number(count/pageSize);
    const pages = Math.ceil(divide);

    if(currentPage >= pages){currentPage = pages}
    if(currentPage <= 0){currentPage = 1}
    const categories = await Category.find({}, null, 
        { limit: pageSize, skip: (currentPage - 1) * pageSize });

    return {
        data: categories,
        total: count
    };
}

async function updateCategory(id, data){
    const result = await Category.findByIdAndUpdate(id, data, {returnDocument: "after"});
    if(!result){
        throw new HttpException(400, "Category does not exist.");
    }
    return result;
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