const express = require('express');
const categoryController = require('../controllers/category.controller');
const router = express.Router();

router.post('/:id', categoryController.updateCategory)
router.post('/', categoryController.createCategory)
router.get('/', categoryController.getCategories)
router.delete('/:id', categoryController.deleteCategory)

module.exports = router;