const Product = require('../models/product.model')

async function createProduct (data){
    const product = new Product({
            name: data.name,
            image: data.image,
            description: data.description,
            category: data?.category
        });
        return await product.save().then(result => result.populate('category', { skipInvalidIds: true }))
}

async function deleteProduct(id){
    return Product.findByIdAndDelete(id);
}

async function getProducts(pageSize, currentPage){
    const count = await Product.countDocuments({});
    const divide = Number(count/pageSize);
    const pages = Math.round(divide);

    if(currentPage >= pages){currentPage = pages}
    if(currentPage <= 0){currentPage = 1}
    const products = Product.find({}, null, 
        { limit: pageSize, skip: (currentPage - 1) * pageSize });

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
    getProducts,
    getProductById,
    updateProductById
}