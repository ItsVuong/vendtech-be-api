const express = require('express');
const productController = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/:id', productController.getProductById);
router.get('/', productController.getProducts)
router.post('/', authenticate, productController.createProductController)
router.post('/:id', authenticate, productController.updateProductById)
router.delete('/:id', authenticate, productController.deleteProduct)

module.exports = router;