
const config = require('../configs/firebase.config');
const { initializeApp } = require('firebase/app');
const uploadService = require('../services/image-upload.service');
const foodAndDrinkService = require('../services/food-drink.service');
const categoryService = require('../services/food-drink-category.service');
const { default: mongoose } = require('mongoose');
const { HttpException } = require('../exceptions/exception');
const { validateCreateFoodAndDrink, validateGetProduct, validateGetFoodAndDrink } = require('../utils/request-validator');

//intialize a firebase application
initializeApp(config.firebaseConfig);

async function createFoodAndDrink(req, res, next){
    try {
        //validate category field
        const error = await validateCreateFoodAndDrink(req.body);
        const uploadedFile = req.file;
        if(!uploadedFile){
            error.image = "Product image is required."
        }
        console.log("error: ", error)
        if (Object.keys(error).length) {
            throw new HttpException(400, 'Bad request.', error);
        }

        //upload image
        const image = await uploadService.uploadImage(uploadedFile);
    
        //create product object 
        const product = {
            name: req.body.name?.trim(),
            image: image,
            description: req.body.description,
            category: req.body.category?.trim()
        }

        foodAndDrinkService.createFoodAndDrink(product)
            .then(result => res.status(201).send(result))
            .catch(error => {
                console.log(error)
                if (image) {
                    uploadService.deleteImage(image.name)
                        .catch(error => console.log(error));
                }
                next(error);
            }) 
    } catch (error) {
        console.log(error);
        next(error);
    }
};

async function deleteFoodAndDrink(req, res, next){
    try {
        if(!req.params.id || !mongoose.isValidObjectId(req.params.id)){
           throw new HttpException(400, "Invalid object id")
        }
        const result = await foodAndDrinkService.deleteFoodAndDrink(req.params.id);
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function getFoodAndDrinks(req, res, next){
    try {
        const error = await validateGetFoodAndDrink(req.query);
        if(Object.keys(error).length){
            throw new HttpException(400, "Bad request.", error);
        }

        const result = await foodAndDrinkService.getFoodAndDrinks(req.query.pageSize, req.query.currentPage, req.query?.category);
        return res.status(200).send(result)
    } catch (error) {
       console.log(error);
       next(error); 
    }
}

async function getFoodAndDrinkById(req, res, next){
    const error = new Error();
    try {
        const id = req.params.id;
        if(!id || !mongoose.isValidObjectId(id)){
            error.status = 400;
            error.message = "invalid product id";
            throw error;
        }

        const result = await foodAndDrinkService.getFoodAndDrinkById(id);
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function updateFoodAndDrink(req, res, next) {
    try {
        //validate object id
        const id = req.params.id;
        if (!id || !mongoose.isValidObjectId(id)) {
            throw new HttpException(400, "Bad request.", {id: "Invalid id."})
        } else if (!await foodAndDrinkService.getFoodAndDrinkById(id)) {
            throw new HttpException(400, "Bad request.", {id: "Item not found."})
        }

        //validate other fields
        const productObject = {};
        if (req.body.name?.trim()) {
            productObject.name = req.body.name;
        }
        if (req.body.description?.trim()) {
            productObject.description = req.body.description;
        }
        //validate category field
        const error = new Error();
        if (req.body.category) {
            if (req.body.category) {
                if (!mongoose.isValidObjectId(req.body.category)) {
                    throw new HttpException(400, "Invalid category id")
                }
                const category = await categoryService.getCategoryById(req.body.category);
                if (!category) {
                    throw new HttpException(400, "Category not found")
                }
            }
            productObject.category = req.body.category;
        }


        //upload image
        const uploadedFile = req.file;
        if (uploadedFile) {
            const image = await uploadService.uploadImage(uploadedFile);
            const oldProduct = await foodAndDrinkService.getFoodAndDrinkById(id);
            uploadService.deleteImage(oldProduct.image?.name);
            productObject.image = image;
        }

        if (!productObject) {
            return res.status(400).json({ message: "update object cannot be empty!" })
        }

        foodAndDrinkService.updateFoodAndDrinkById(id, productObject)
            .then(result => {
                res.status(201).send(result)
            })
            .catch(error => {
                console.log(error)
                if (image) {
                    uploadService.deleteImage(image.name)
                        .catch(error => console.log(error));
                }
            })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    createFoodAndDrink,
    deleteFoodAndDrink,
    getFoodAndDrinks,
    getFoodAndDrinkById,
    updateFoodAndDrink
}