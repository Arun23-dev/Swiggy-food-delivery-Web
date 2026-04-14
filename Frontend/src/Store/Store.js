import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/CartSlice'
import resturantReducer from '../features/ResturantSlice'
import foodMenduReducer from "../features/FoodMenuSlice";
import userReducer from "../features/UserSlice"
import reDirect from "../features/RedirectSlice"
import orderReducer from "../features/OrderSlice"

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