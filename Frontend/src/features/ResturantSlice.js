import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosClient from "@/Utils/axiosClient";


export const fetchResturant = createAsyncThunk(
    'resturant/fetchResturant',
    async (_,{rejectWithValue}) => {

        try {

           const response= await axiosClient.get('api/restaurants');
            return response.data ;
        }
        catch (error) {
            return rejectWithValue({ message: "Error occurred" })
        }
    })

export const resturantSlice = createSlice({
    name: 'resturant',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: { },
    extraReducers:(builder)=>{
        builder.
        addCase(fetchResturant.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchResturant.fulfilled,(state,action)=>{
           
            state.data=action.payload;
            state.loading=false;
        })
        .addCase(fetchResturant.rejected,(state,action)=>{
             state.error=action.payload;
            state.loading=false;
           
        })
    }

})
export default resturantSlice.reducer;