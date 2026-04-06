import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './CartSlice'
import resturantReducer from './ResturantSlice'
import foodMenduReducer from "./FoodMenuSlice";

export default configureStore({
    reducer:{
        cart:cartReducer,
        resturant:resturantReducer,
        foodMenu:foodMenduReducer
    }
})