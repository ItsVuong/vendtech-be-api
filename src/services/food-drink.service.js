
const FoodAndDrink = require('../models/food-drink.model')
const uploadService = require('../services/image-upload.service');

async function createFoodAndDrink (data){
    const product = new FoodAndDrink({
            name: data.name,
            image: data.image,
            description: data.description,
            category: data?.category
        });
        return await product.save().then(result => result.populate('category'))
}

async function deleteFoodAndDrink(id){
    const result = await FoodAndDrink.findByIdAndDelete(id);
    if(result){
        uploadService.deleteImage(result.image.name);
    }
    return result;
}

async function deleteFoodAndDrinkByCategory(categoryId){
    const products = await getFoodAndDrinks(0,0,categoryId);
    products.data.forEach(element => {
        uploadService.deleteImage(element.image.name);
    });
    return FoodAndDrink.deleteMany({category: categoryId});
}

async function getFoodAndDrinks(pageSize, currentPage, category){
    const query = {};
    if(category){
        query.category = category;
    }

    const count = await FoodAndDrink.countDocuments({...query});
    const divide = Number(count/pageSize);
    const pages = Math.ceil(divide);

    if(currentPage >= pages){currentPage = pages}
    if(currentPage <= 0){currentPage = 1}
    const products = await FoodAndDrink.find({...query}, null, 
        { limit: pageSize, skip: (currentPage - 1) * pageSize })
        .populate('category');

    return {
        data: products,
        total: count
    };
}

async function getFoodAndDrinkById(id){
    return FoodAndDrink.findById(id);
}

async function updateFoodAndDrinkById(id, updateData){
    return FoodAndDrink.findByIdAndUpdate(id, updateData, { returnDocument: "after" });
}

module.exports = {
    createFoodAndDrink,
    deleteFoodAndDrink,
    deleteFoodAndDrinkByCategory,
    getFoodAndDrinks,
    getFoodAndDrinkById,
    updateFoodAndDrinkById
}