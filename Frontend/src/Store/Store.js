import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../slices/CartSlice'
import resturantReducer from '../slices/ResturantSlice'
import foodMenduReducer from "../slices/FoodMenuSlice";
import userReducer from "../slices/UserSlice"
import reDirect from "../slices/RedirectSlice"
import orderReducer from "../slices/OrderSlice"

export default configureStore({
    reducer:{
        cart:cartReducer,
        resturant:resturantReducer,
        foodMenu:foodMenduReducer,
        user:userReducer,
        redirect:reDirect,
        order:orderReducer,
        
    }
})