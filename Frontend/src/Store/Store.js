import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/CartSlice'
import resturantReducer from '../features/ResturantSlice'
import foodMenduReducer from "../features/FoodMenuSlice";
import authReducer from "../features/authSlice"

export default configureStore({
    reducer:{
        cart:cartReducer,
        resturant:resturantReducer,
        foodMenu:foodMenduReducer,
        auth:authReducer,

    }
})