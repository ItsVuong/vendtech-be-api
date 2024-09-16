const express = require('express');
const categoryController = require('../controllers/food-drink-category.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/:id', authenticate, categoryController.updateCategory)
router.post('/', authenticate, categoryController.createCategory)
router.get('/', categoryController.getCategories)
router.get('/:id', categoryController.getCategoryById)
router.delete('/:id', authenticate, categoryController.deleteCategory)

module.exports = router;