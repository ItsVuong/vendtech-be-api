
const express = require('express');
const FoodAndDrinkController = require('../controllers/food-drink.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/:id', FoodAndDrinkController.getFoodAndDrinkById);
router.get('/', FoodAndDrinkController.getFoodAndDrinks)
router.post('/', authenticate, FoodAndDrinkController.createFoodAndDrink)
router.post('/:id', authenticate, FoodAndDrinkController.updateFoodAndDrink)
router.delete('/:id', authenticate, FoodAndDrinkController.deleteFoodAndDrink)

module.exports = router;