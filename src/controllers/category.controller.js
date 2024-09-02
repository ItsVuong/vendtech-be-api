const { default: mongoose } = require("mongoose");
const categoryService = require("../services/category.service");
const { HttpException } = require("../exceptions/exception");
const uploadService = require('../services/image-upload.service');
const productService = require('../services/product.service');
const { validateCategoryUpdate } = require("../utils/request-validator");

async function createCategory(req, res, next){
    console.log(req.body)
    try {
        const error = {};
        const uploadedFile = req.file;
        if(!req.body.name?.trim()){
            error.name= "Category name is missing.";
        }
        if (!req.body.description?.trim()){
            error.description = "Category description is missing.";
        }
        if(!uploadedFile){
            error.image = "Image is missing."
        }

        if(Object.keys(error).length){
            throw new HttpException(400, "Bad request.", error);
        }

        //upload image
        const image = await uploadService.uploadImage(uploadedFile);

        categoryService.createCategory({name: req.body.name, description: req.body.description, image: image})
            .then(result => res.status(201).send(result))
            .catch(error => {
                console.log(error);
                if(image){
                    uploadService.deleteImage(image.name)
                    .catch(error => console.log(error));
                }
            })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function getCategories(req, res, next){
    try {
        const regex = /^\d+$/
        if(!req.query.pageSize || !regex.test(req.query.pageSize)){
            throw new HttpException(400, "Invalid page size.")
        }

        const result = await categoryService.getCategories(req.query.pageSize, req.query.currentPage);
        return res.status(200).send(result)
    } catch (error) {
       console.log(error);
       next(error); 
    }
}

async function updateCategory(req, res, next) {
    try {
        const uploadedFile = req.file;
        const id = req.params.id;
        const category = { id, ...req.body }
        
        const error = await validateCategoryUpdate(category, uploadedFile?.mimetype);
        if (Object.keys(error).length) {
            throw new HttpException(400, "Bad request.", error);
        }

        //upload image
        if (uploadedFile) {
            const image = await uploadService.uploadImage(uploadedFile);
            if(image){
                category.image = image;
                const oldProduct = await categoryService.getCategoryById(id);
                uploadService.deleteImage(oldProduct.image?.name);
            }
        }

        categoryService.updateCategory(id, category)
            .then(result => {
                res.status(201).send(result)
            })
            .catch(error => {
                console.log(error)
                if (image) {
                    uploadService.deleteImage(image.name)
                        .catch(error => console.log(error));
                }
                next(error);
            });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function deleteCategory(req, res, next){
    try {
        const categoryId = req.params.id;
        const error = new Error()
        if(!mongoose.isValidObjectId(categoryId)){
            error.status = 400;
            error.message = "invalid object id."
            throw error
        }
        const result = await categoryService.deleteCategory(categoryId);
        if(!result){
            return res.status(400).json({"message": "Category id not found"})
        } 
        
        //delete category image
        uploadService.deleteImage(result?.image.name);
        //delete all products by category
        productService.deleteProductByCategory(categoryId);
        return res.status(201).send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    createCategory,
    getCategories,
    updateCategory, 
    deleteCategory
}
