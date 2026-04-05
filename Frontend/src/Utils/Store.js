import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './Slicer1'

export default configureStore({
    reducer:{
        cart:cartReducer

    }
})