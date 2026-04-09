import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/CartSlice'
import resturantReducer from '../features/ResturantSlice'
import foodMenduReducer from "../features/FoodMenuSlice";
import authReducer from "../features/authSlice"
import reDirect from "../features/RedirectSlice"

export default configureStore({
    reducer:{
        cart:cartReducer,
        resturant:resturantReducer,
        foodMenu:foodMenduReducer,
        auth:authReducer,
        redirect:reDirect

    }
})