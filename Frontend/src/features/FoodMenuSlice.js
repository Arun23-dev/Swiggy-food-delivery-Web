
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from '../Utils/axiosClient';

export const fetchFoodMenu = createAsyncThunk(
    'foodMenu/fetchFoodMenu',
    async (restaurantId, { rejectWithValue }) => {

        try {
            
            const response=await axiosClient.get(`/api/restaurants/${restaurantId}`)
             
            if (response.status !== 200) {
                throw new Error("Failed to fetch menu");
            }

            return {restaurantId,data:response.data};
 
        }
        catch (error) {
            return rejectWithValue({ message: error.message })
        }

    }
)

export const foodMenuSlice = createSlice({
    name: 'foodMenu',
    initialState: {
        cache:{},
        loading: false,
        error: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFoodMenu.pending, (state) => {
                state.loading = true;
                state.error = false;

            })
            .addCase(fetchFoodMenu.fulfilled, (state, action) => {
                const {restaurantId,data}=action.payload;
               state.cache[restaurantId]=data;
                state.loading = false;
            })
            .addCase(fetchFoodMenu.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
    }
})
export default foodMenuSlice.reducer;