const Product = require('../models/product.model');
const { deleteFile } = require('../utils/cloudinary.util');

/**
 * Create a new product document, saving images are already uploaded
 * @param {Object} data - product data with images and mainImage
 */
async function createProduct(data) {
  try {
    const product = new Product({
      name: data.name,
      description: data.description,
      category: data.category,
      images: data.images,
      mainImage: data.mainImage,
    });

    const saved = await product.save();
    return saved.populate('category');
  } catch (err) {
    // cleanup uploaded images on failure
    if (data.images?.length) {
      data.images.forEach(img => deleteFile(img.name).catch(() => { }));
    }
    if (data.mainImage?.name) {
      deleteFile(data.mainImage.name).catch(() => { });
    }
    throw err;
  }
}

/**
 * Delete product by id and remove its images from Cloudinary
 * @param {String} id
 */
async function deleteProduct(id) {
  const product = await Product.findByIdAndDelete(id);
  if (product) {
    const toDelete = [
      ...product.images.map(img => img.name),
      product.mainImage?.name,
    ];
    toDelete.forEach(publicId => {
      if (publicId) deleteFile(publicId).catch(() => { });
    });
  }
  return product;
}

/**
 * Delete all products in a category, cleaning up images
 */
async function deleteProductByCategory(categoryId) {
  const products = await Product.find({ category: categoryId });
  // delete cloudinary files
  products.forEach(prod => {
    prod.images.forEach(img => deleteFile(img.name).catch(() => { }));
    if (prod.mainImage?.name) deleteFile(prod.mainImage.name).catch(() => { });
  });
  return Product.deleteMany({ category: categoryId });
}

/**
 * Fetch paginated products with optional category filter
 */
async function getProducts(pageSize = 10, currentPage = 1, category) {
  const filter = {};
  if (category) filter.category = category;

  const total = await Product.countDocuments(filter);
  const pages = Math.max(Math.ceil(total / pageSize), 1);
  const page = Math.min(Math.max(currentPage, 1), pages);

  const data = await Product.find(filter)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate('category');

  return { data, total };
}

/**
 * Get single product by id
 */
async function getProductById(id) {
  return Product.findById(id).populate('category');
}

/**
 * Update a product and return the updated document
 */
async function updateProductById(id, updateData) {
  return Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('category');
}

module.exports = {
  createProduct,
  deleteProduct,
  deleteProductByCategory,
  getProducts,
  getProductById,
  updateProductById,
};
