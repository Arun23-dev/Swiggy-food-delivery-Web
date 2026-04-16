const express = require('express');
const restaurantRouter = express.Router();

const { getAllRestaurants, getRestaurantMenu} = require('../controllers/restaurant-controller');


restaurantRouter.get('/',getAllRestaurants);
restaurantRouter.get('/:restaurantId',getRestaurantMenu );


module.exports = restaurantRouter;

