const { HttpException } = require('../exceptions/exception');
const categoryService = require('../services/category.service');
const foodAndDrinkCategoryService = require('../services/food-drink-category.service');
const { default: mongoose } = require('mongoose');
const productService = require('../services/product.service');

function isEmail(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.match(regex) ? true : false;
}

function validateGuestInfo(guestInfo){
    if(!guestInfo.firstName){
        error.firstName = "First name is invalid";
    }
    if(!guestInfo.lastName){
        error.lastName = "Last name is invalid";
    }
    if(!guestInfo.email || !isEmail(guestInfo.email)){
        error.email = "Email is invalid";
    }
    if(!guestInfo.message){
        error.message = "Message is invalid"
    }
    if(guestInfo.message && guestInfo.message.length > 2500){
        error.message = "Message too long"
    }

    return error;
}

async function validateProduct(product){
    const error = {};

    if(!product.name?.trim()){
        error.username = "Product name cannot be empty";
    }
    if(!product.description?.trim()){
        error.description = "Product description cannot be empty";
    }
    if(!product.category?.trim()){
        error.category = "Product category cannot be empty";
    } else {
        if (!mongoose.isValidObjectId(product.category)){
            error.category = "Invalid category Id";
        }
        else {
            const category = await categoryService.getCategoryById(product.category.trim());
            category ? true : error.category = "Category not found."
        }
    }
    return error;
}

async function validateProductUpdate(product) {
    //validate object id
    const id = product.id;
    validateId(id);
    if (!await productService.getProductById(id)) {
        throw new HttpException(400, "Bad request.", { id: "Item not found." })
    }
    //validate other fields
    const productObject = {};
    if (product.name?.trim()) {
        productObject.name = product.name.trim();
    }
    if (product.description?.trim()) {
        productObject.description = product.description.trim();
    }
    //validate category field
    if (product.category) {
        if (product.category) {
            if (!mongoose.isValidObjectId(product.category)) {
                throw new HttpException(400, "Invalid category id")
            }
            const category = await categoryService.getCategoryById(product.category);
            if (!category) {
                throw new HttpException(400, "Category not found")
            }
        }
        productObject.category = product.category;
    }
    //validate images to be delete (nothing much, might update later)
    if(product.deletedImages){
        productObject.deletedImages = product.deletedImages;
    }
    return productObject;
}

async function validateCreateFoodAndDrink(product){
    const error = {};

    if(!product.name?.trim()){
        error.username = "Product name cannot be empty";
    }
    if(!product.description?.trim()){
        error.description = "Product description cannot be empty";
    }
    if(!product.category?.trim()){
        error.category = "Product category cannot be empty";
    } else {
        if (!mongoose.isValidObjectId(product.category)){
            error.category = "Invalid category Id";
        }
        else {
            const category = await foodAndDrinkCategoryService.getCategoryById(product.category.trim());
            category ? true : error.category = "Category not found."
        }
    }

    return error;
}
async function validateGetProduct(query) {
    const error = {};
    const regex = /^\d+$/
    if (!query.pageSize || !regex.test(query.pageSize)) {
        error.pageSize = "invalid page size."
    }
    const categoryId = query?.category;
    if (categoryId) {
        if (!mongoose.isValidObjectId(categoryId)) {
            error.category = "Invalid category Id.";
        } else if (!await categoryService.getCategoryById(categoryId)) {
            error.category = "Category Id does not exsist.";
        }
    }
    return error;
}

async function validateGetFoodAndDrink(query) {
    const error = {};
    const regex = /^\d+$/
    if (!query.pageSize || !regex.test(query.pageSize)) {
        error.pageSize = "invalid page size."
    }
    const categoryId = query?.category;
    if (categoryId) {
        if (!mongoose.isValidObjectId(categoryId)) {
            error.category = "Invalid category Id.";
        } else if (!await foodAndDrinkCategoryService.getCategoryById(categoryId)) {
            error.category = "Category Id does not exsist.";
        }
    }
    return error;
}

function validateUser(user){
    const error = {};

    if(!user.username){
        error.username = "Username cannot be empty";
    }
    if(!user.password){
        error.password = "Password cannot be empty";
    }
    if(!user.email || !isEmail(user.email)){
        error.email = "Email is invalid";
    }

    return error;
}

function validateUserAuthenticate(userAuth){
    const error = {};

    if(!userAuth.username){
        error.username = "Username cannot be empty";
    }
    if(!userAuth.password){
        error.password = "Password cannot be empty";
    }

    return error;
}

async function validateCategoryUpdate(category, image) {
    const error = {};
    if(!category.description?.trim() && !category.name?.trim() && !image){
        error.error = "Please provide atleast one update field.";
        return error;
    }
    if (!mongoose.isValidObjectId(category.id)) {
        error.category = "Category id is invalid.";
    } else if (!await categoryService.getCategoryById(category.id)){
        error.category = "Category does not exist.";
        return error;
    }
    if (category.description && !category.description?.trim()){
        error.description = "Category description canot be empty.";
    }
    if (category.name && !category.name?.trim()){
        error.name = "Category name cannot be empty.";
    }
    return error;
}

async function validateFoodAndDrinkCategoryUpdate(category, image) {
    const error = {};
    if(!category.description?.trim() && !category.name?.trim() && !image){
        error.error = "Please provide atleast one update field.";
        return error;
    }
    if (!mongoose.isValidObjectId(category.id)) {
        error.category = "Category id is invalid.";
    } else if (!await foodAndDrinkCategoryService.getCategoryById(category.id)){
        error.category = "Category does not exist.";
        return error;
    }
    if (category.description && !category.description?.trim()){
        error.description = "Category description canot be empty.";
    }
    if (category.name && !category.name?.trim()){
        error.name = "Category name cannot be empty.";
    }
    return error;
}

function validateId(id) {
    if (!id) {
        throw new HttpException(400, "Bad request.", { id: "Please provide an id." });
    } else if (!mongoose.isValidObjectId(id)) {
        throw new HttpException(400, "Bad request.", { id: "Item id is invalid." });
    }
}

module.exports = {
    validateId,
    validateGuestInfo,
    validateUser,
    validateUserAuthenticate,
    validateCategoryUpdate,
    validateProduct,
    validateGetProduct,
    validateProductUpdate,
    validateCreateFoodAndDrink,
    validateFoodAndDrinkCategoryUpdate,
    validateGetFoodAndDrink
}