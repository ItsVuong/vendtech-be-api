const Product = require('../models/product.model')
const uploadService = require('../services/image-upload.service');

async function createProduct (data){
    const product = new Product({
            name: data.name,
            mainImage: data.mainImage,
            images: data.images,
            description: data.description,
            category: data?.category
        });
        return await product.save().then(result => result.populate('category'))
}

async function deleteProduct(id){
    const result = await Product.findByIdAndDelete(id);
    if(result){
        result.images.forEach(img => {
            uploadService.deleteImage(img.name);
        });
        uploadService.deleteImage(result.mainImage?.name)
    }
    return result;
}

async function deleteProductByCategory(categoryId){
    const products = await getProducts(0,0,categoryId);
    products.data.forEach(element => {
        element.images.forEach(img => {
            uploadService.deleteImage(img.name);
        });
        uploadService.deleteImage(element.mainImage?.name)
    });
    return Product.deleteMany({category: categoryId});
}

async function getProducts(pageSize, currentPage, category){
    const query = {};
    if(category){
        query.category = category;
    }

    const count = await Product.countDocuments({...query});
    const divide = Number(count/pageSize);
    const pages = Math.ceil(divide);

    if(currentPage >= pages){currentPage = pages}
    if(currentPage <= 0){currentPage = 1}
    const products = await Product.find({...query}, null, 
        { limit: pageSize, skip: (currentPage - 1) * pageSize })
        .populate('category');

    return {
        data: products,
        total: count
    };
}

async function getProductById(id){
    return Product.findById(id);
}

async function updateProductById(id, updateData){
    return Product.findByIdAndUpdate(id, updateData, { returnDocument: "after" });
}

module.exports = {
    createProduct,
    deleteProduct,
    deleteProductByCategory,
    getProducts,
    getProductById,
    updateProductById
}