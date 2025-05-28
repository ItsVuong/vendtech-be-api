const fs = require("fs");
const mongoose = require('mongoose');
const { HttpException } = require('../exceptions/exception');
const { validateCreateFoodAndDrink, validateGetFoodAndDrink } = require('../utils/request-validator');
const foodAndDrinkService = require('../services/food-drink.service');
const categoryService = require('../services/food-drink-category.service');
const { uploadFile, deleteFile } = require('../utils/cloudinary.util');

// Helper: upload image and cleanup
async function handleUpload(file) {
  const { public_id: name, url } = await uploadFile(file.path, 'food_and_drink');
  fs.unlink(file.path, () => {});
  return { name, url };
}

async function createFoodAndDrink(req, res, next) {
  try {
    const errors = {};
    const { name, description, category } = req.body;
    const file = req.file;

    if (!name?.trim()) errors.name = 'Name is required.';
    if (!description?.trim()) errors.description = 'Description is required.';
    if (!category?.trim()) errors.category = 'Category is required.';
    if (!file) errors.image = 'Image is required.';
    if (Object.keys(errors).length) throw new HttpException(400, 'Bad request.', errors);

    // Validate category ID
    if (!mongoose.isValidObjectId(category) || !await categoryService.getCategoryById(category)) {
      throw new HttpException(400, 'Invalid or non-existent category.');
    }

    // Upload image
    const image = await handleUpload(file);

    // Create record
    const item = { name: name.trim(), description: description.trim(), category: category.trim(), image };
    const result = await foodAndDrinkService.createFoodAndDrink(item);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    // Cleanup image on error
    if (err.image?.name) deleteFile(err.image.name).catch(() => {});
    next(err);
  }
}

async function deleteFoodAndDrink(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new HttpException(400, 'Invalid ID.');

    const result = await foodAndDrinkService.deleteFoodAndDrink(id);
    if (!result) throw new HttpException(404, 'Item not found.');

    // Cleanup image
    deleteFile(result.image.name).catch(() => {});
    res.status(200).json({ message: 'Deleted successfully.', data: result });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function getFoodAndDrinks(req, res, next) {
  try {
    const errors = await validateGetFoodAndDrink(req.query);
    if (Object.keys(errors).length) throw new HttpException(400, 'Bad request.', errors);

    const { pageSize, currentPage, category } = req.query;
    const result = await foodAndDrinkService.getFoodAndDrinks(Number(pageSize), Number(currentPage), category);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function getFoodAndDrinkById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new HttpException(400, 'Invalid ID.');

    const result = await foodAndDrinkService.getFoodAndDrinkById(id);
    if (!result) throw new HttpException(404, 'Item not found.');

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function updateFoodAndDrink(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new HttpException(400, 'Invalid ID.');

    const existing = await foodAndDrinkService.getFoodAndDrinkById(id);
    if (!existing) throw new HttpException(404, 'Item not found.');

    const { name, description, category } = req.body;
    const file = req.file;
    const updates = {};
    const errors = {};

    if (name?.trim()) updates.name = name.trim();
    if (description?.trim()) updates.description = description.trim();
    if (category) {
      if (!mongoose.isValidObjectId(category) || !await categoryService.getCategoryById(category)) {
        errors.category = 'Invalid or non-existent category.';
      } else {
        updates.category = category.trim();
      }
    }
    if (file) {
      const image = await handleUpload(file);
      updates.image = image;
      // delete old
      deleteFile(existing.image.name).catch(() => {});
    }

    if (Object.keys(updates).length === 0 && Object.keys(errors).length === 0) {
      throw new HttpException(400, 'No valid fields to update.');
    }
    if (Object.keys(errors).length) throw new HttpException(400, 'Bad request.', errors);

    const result = await foodAndDrinkService.updateFoodAndDrinkById(id, updates);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = {
  createFoodAndDrink,
  deleteFoodAndDrink,
  getFoodAndDrinks,
  getFoodAndDrinkById,
  updateFoodAndDrink,
};
