const fs = require("fs");
const mongoose = require("mongoose");
const { HttpException } = require("../exceptions/exception");
const { validateCategoryUpdate, validateId } = require("../utils/request-validator");
const productService = require("../services/product.service");
const categoryService = require("../services/category.service");
const { uploadFile, deleteFile } = require("../utils/cloudinary.util");

// Helper: upload single file, return { name, url }
async function handleUpload(file) {
  const { public_id: name, url } = await uploadFile(file.path, "categories");
  fs.unlink(file.path, () => {});
  return { name, url };
}

async function createCategory(req, res, next) {
  try {
    const errors = {};
    const { name, description } = req.body;
    const file = req.file;

    if (!name?.trim()) errors.name = "Category name is missing.";
    if (!description?.trim()) errors.description = "Category description is missing.";
    if (!file) errors.image = "Image is required.";
    if (Object.keys(errors).length) throw new HttpException(400, "Bad request.", errors);

    const image = await handleUpload(file);
    const categoryData = { name: name.trim(), description: description.trim(), image };
    const result = await categoryService.createCategory(categoryData);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    // cleanup uploaded image on error
    if (err.image) deleteFile(err.image.name).catch(() => {});
    next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    const { pageSize, currentPage } = req.query;
    if (!pageSize || !/^\d+$/.test(pageSize)) {
      throw new HttpException(400, "Invalid page size.");
    }
    const result = await categoryService.getCategories(Number(pageSize), Number(currentPage));
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;
    validateId(id);
    const result = await categoryService.getCategoryById(id);
    if (!result) {
      throw new HttpException(404, "Category not found.");
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    validateId(id);
    const existing = await categoryService.getCategoryById(id);
    if (!existing) throw new HttpException(404, "Category not found.");

    const file = req.file;
    const updates = { id, ...req.body };
    const errors = await validateCategoryUpdate(updates, file?.mimetype);
    if (Object.keys(errors).length) throw new HttpException(400, "Bad request.", errors);

    // Handle new image
    if (file) {
      const newImage = await handleUpload(file);
      updates.image = newImage;
      // delete old image
      deleteFile(existing.image.name).catch(() => {});
    }

    const result = await categoryService.updateCategory(id, updates);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    validateId(id);
    const result = await categoryService.deleteCategory(id);
    if (!result) {
      throw new HttpException(404, "Category not found.");
    }
    // cleanup image
    deleteFile(result.image.name).catch(() => {});
    // delete related products
    productService.deleteProductByCategory(id).catch(() => {});

    res.status(200).json({ message: "Category deleted.", data: result });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
