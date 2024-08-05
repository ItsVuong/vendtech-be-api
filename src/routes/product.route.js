const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();

router.get('/:id', productController.getProductById);
router.get('/', productController.getProducts)
router.post('/', productController.createProductController)
router.post('/:id', productController.updateProductById)
router.delete('/:id', productController.deleteProduct)

module.exports = router;