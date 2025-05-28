const fs = require("fs");
const { HttpException } = require("../exceptions/exception");
const {
  validateProduct,
  validateGetProduct,
  validateProductUpdate,
  validateId,
} = require("../utils/request-validator");
const { uploadFile, deleteFile } = require("../utils/cloudinary.util");
const productService = require('../services/product.service');

// Helper: upload array of files, return array of { name, url }
async function uploadImages(files = []) {
  const uploaded = [];
  for (const file of files) {
    try {
      const { public_id: name, url } = await uploadFile(file.path);
      uploaded.push({ name, url });
    } finally {
      fs.unlink(file.path, () => { });
    }
  }
  return uploaded;
}

async function createProductController(req, res, next) {
  try {
    const errors = await validateProduct(req.body);
    const imagesFiles = req.files?.fileName || [];
    const mainImageFiles = req.files?.mainImage || [];

    if (!imagesFiles.length) errors.images = "Product image is required.";
    if (!mainImageFiles.length) errors.mainImage = "Main image is required.";
    if (Object.keys(errors).length) {
      throw new HttpException(400, "Bad request.", errors);
    }

    // Upload images
    console.log(imagesFiles)
    const images = await uploadImages(imagesFiles);
    const [{ name, url }] = await uploadImages(mainImageFiles);

    const productData = {
      name: req.body.name.trim(),
      description: req.body.description,
      category: req.body.category.trim(),
      images,
      mainImage: { name, url },
    };

    const result = await productService.createProduct(productData);
    return res.status(201).json(result);
  } catch (err) {
    // cleanup on error
    if (err.images) {
      err.images.forEach(img => deleteFile(img.name).catch(() => { }));
    }
    return next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    validateId(req.params.id);
    const result = await productService.deleteProduct(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

async function getProducts(req, res, next) {
  try {
    const errors = await validateGetProduct(req.query);
    if (Object.keys(errors).length) {
      throw new HttpException(400, "Bad request.", errors);
    }

    const { pageSize, currentPage, category } = req.query;
    const result = await productService.getProducts(pageSize, currentPage, category);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    validateId(id);
    const result = await productService.getProductById(id);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

async function updateProductById(req, res, next) {
  try {
    validateId(req.params.id);
    const updates = await validateProductUpdate({ id: req.params.id, ...req.body });
    const existing = await productService.getProductById(req.params.id);
    if (!existing) throw new HttpException(404, "Product not found.");

    // Handle deleted images
    let images = existing.images || [];
    if (updates.deletedImages?.length) {
      images = images.filter(img => {
        if (updates.deletedImages.includes(String(img._id))) {
          deleteFile(img.name).catch(() => { });
          return false;
        }
        return true;
      });
    }

    // Upload new images
    const newImages = await uploadImages(req.files?.fileName);
    images = images.concat(newImages);

    // Upload and replace mainImage
    if (req.files?.mainImage?.length) {
      // remove old main
      if (existing.mainImage?.name) deleteFile(existing.mainImage.name).catch(() => { });
      const [{ name, url }] = await uploadImages(req.files.mainImage);
      updates.mainImage = { name, url };
    }
    updates.images = images;

    const result = await productService.updateProductById(req.params.id, updates);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createProductController,
  deleteProduct,
  getProducts,
  getProductById,
  updateProductById,
};
