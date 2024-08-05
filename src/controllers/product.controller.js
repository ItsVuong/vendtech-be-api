const config = require('../configs/firebase.config');
const { initializeApp } = require('firebase/app');
const uploadService = require('../services/image-upload.service');
const productService = require('../services/product.service');
const categoryService = require('../services/category.service');
const { default: mongoose } = require('mongoose');
const { HttpException } = require('../exceptions/exception');

//intialize a firebase application
initializeApp(config.firebaseConfig);

async function createProductController(req, res, next){
    try{
        //validate category field
        if(req.body.category){
            if(!mongoose.isValidObjectId(req.body.category)){
                throw new HttpException(400, "Invalid category id")
            }
            const category = await categoryService.getCategoryById(req.body.category);
            if(!category){
                throw new HttpException(400, "Category not found")
            }
        }
        //validate other fields
        const uploadedFile = req.file;
        if(!uploadedFile || !req.body.name || !req.body.description){
            return res.status(400).json({ message: 'missing field' })
        }

        //upload image
        const image = await uploadService.uploadImage(uploadedFile);
    
        //create product object 
        const product = {
            name: req.body.name,
            image: image,
            description: req.body.description,
            category: req.body?.category
        }

        productService.createProduct(product)
            .then(result => res.status(201).send(result))
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
};

async function deleteProduct(req, res, next){
    try {
        const error = new Error();
        if(!req.params.id || !mongoose.isValidObjectId(req.params.id)){
            error.status = 400;
            error.message = "invalid product id";
            throw error;
        }
        const result = await productService.deleteProduct(req.params.id);
        if(result){
            await uploadService.deleteImage(result.image.name);
        }
        res.status(201).send(result)
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function getProducts(req, res, next){
    try {
        const error = new Error();
        const regex = /^\d+$/
        if(!req.query.pageSize || !regex.test(req.query.pageSize)){
            error.status=400;
            error.message="invalid page size."
            throw error;
        }

        const result = await productService.getProducts(req.query.pageSize, req.query.currentPage);
        return res.status(200).send(result)
    } catch (error) {
       console.log(error);
       next(error); 
    }
}

async function getProductById(req, res, next){
    const error = new Error();
    try {
        const id = req.params.id;
        if(!id || !mongoose.isValidObjectId(id)){
            error.status = 400;
            error.message = "invalid product id";
            throw error;
        }

        const result = await productService.getProductById(id);
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function updateProductById(req, res, next){
    //validate object id
    const id = req.params.id;
    if (!id || !mongoose.isValidObjectId(id)) {
        error.status = 400;
        error.message = "invalid product id";
        throw error;
    }

    //validate other fields
    const productObject = {};
    if(req.body.name?.trim()){
        productObject.name = req.body.name;
    }
    if(req.body.description?.trim()){
        productObject.description = req.body.description;
    }
    //validate category field
    const error = new Error();
    if(req.body.category){
        if(req.body.category){
            if(!mongoose.isValidObjectId(req.body.category)){
                throw new HttpException(400, "Invalid category id")
            }
            const category = await categoryService.getCategoryById(req.body.category);
            if(!category){
                throw new HttpException(400, "Category not found")
            }
        }
        productObject.category = req.body.category;
    }


    //upload image
    const uploadedFile = req.file;
    if(uploadedFile){
        const image = await uploadService.uploadImage(uploadedFile);
        const oldProduct = await productService.getProductById(id);
        uploadService.deleteImage(oldProduct.image?.name);
        productObject.image = image;
    }
    
    if(!productObject){
        return res.status(400).json({message: "update object cannot be empty!"})
    }

    productService.updateProductById(id, productObject)
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
    
}

module.exports = {
    createProductController,
    deleteProduct,
    getProducts,
    getProductById,
    updateProductById
}