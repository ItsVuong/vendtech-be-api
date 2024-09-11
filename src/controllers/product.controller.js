const config = require('../configs/firebase.config');
const { initializeApp } = require('firebase/app');
const uploadService = require('../services/image-upload.service');
const productService = require('../services/product.service');
const categoryService = require('../services/category.service');
const { default: mongoose } = require('mongoose');
const { HttpException } = require('../exceptions/exception');
const { validateProduct, validateGetProduct, validateProductUpdate, validateId } = require('../utils/request-validator');

//intialize a firebase application
initializeApp(config.firebaseConfig);

async function createProductController(req, res, next) {
    try {
        //validate
        const error = await validateProduct(req.body);
        const uploadedFile = req.files['fileName'];
        if (!uploadedFile || uploadedFile?.length == 0) {
            error.images = "Product image is required."
        }
        const mainImageFile = req.files['mainImage'];
        if(!mainImageFile || mainImageFile?.length == 0){
            error.mainImage = "Main image is required."
        }
        if (Object.keys(error).length) {
            throw new HttpException(400, 'Bad request.', error);
        }

        //upload image
        const images = [];
        for (const file of uploadedFile) {
            const image = await uploadService.uploadImage(file);
            images.push(image);
        }
        //upload main image
        const mainImage = await uploadService.uploadImage(mainImageFile[0]);

        //create product object 
        const product = {
            name: req.body.name?.trim(),
            images: images,
            mainImage: mainImage,
            description: req.body.description,
            category: req.body.category?.trim()
        }

        productService.createProduct(product)
            .then(result => res.status(201).send(result))
            .catch(error => {
                console.log(error)
                if (images && images.length > 0) {
                    images.forEach(image => {
                        uploadService.deleteImage(image.name)
                            .catch(error => console.log(error));
                    })
                }
                next(error);
            })
    } catch (error) {
        console.log(error);
        next(error);
    }
};

async function deleteProduct(req, res, next){
    try {
        validateId(req.params.id);
        const result = await productService.deleteProduct(req.params.id);
        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function getProducts(req, res, next){
    try {
        const error = await validateGetProduct(req.query);
        if(Object.keys(error).length){
            throw new HttpException(400, "Bad request.", error);
        }

        const result = await productService.getProducts(req.query.pageSize, req.query.currentPage, req.query?.category);
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

async function updateProductById(req, res, next) {
    try {
        //validate id and product object
        req.body.id = req.params?.id;
        const productObject = {...await validateProductUpdate(req.body)};
        
        const product = await productService.getProductById(req.params.id);
        const images = [...product.images];
        //remove images
        if(productObject.deletedImages){
            images.map(image => {
                if(productObject.deletedImages.includes(image._id)){
                    images.splice(images.indexOf(image), 1);
                    uploadService.deleteImage(image.name);
                }
            });
            productObject.images = images;      
        }
        //upload images
        const uploadedFiles = req.files['fileName'];
        if (uploadedFiles && uploadedFiles.length > 0) {
            //const images = await uploadService.uploadImage(uploadedFiles);
            for(const file of uploadedFiles){
                const image = await uploadService.uploadImage(file);
                images.push(image);
            }
            productObject.images = images;
        }
        //upload main image
        const mainImageFile = req.files['mainImage'];
        if(mainImageFile){
            const mainImage = await uploadService.uploadImage(mainImageFile[0]);
            productObject.mainImage = mainImage;
            uploadService.deleteImage(product.mainImage.name)
        }
        //check if product is empty
        if (!productObject) {
            return res.status(400).json({ message: "update object cannot be empty!" })
        }
        //update product in database
        productService.updateProductById(req.params.id, productObject)
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
    createProductController,
    deleteProduct,
    getProducts,
    getProductById,
    updateProductById
}