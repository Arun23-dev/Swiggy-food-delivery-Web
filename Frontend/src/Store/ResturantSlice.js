import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"


export const fetchResturant = createAsyncThunk(
    'resturant/fetchResturant',
    async (_,{rejectWithValue}) => {

        try {

            const proxyServer = "https://cors-anywhere.herokuapp.com/"
            const swiggyAPI = "https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.7040592&lng=77.10249019999999&is-seo-homepage-enabled=true";
            const response = await fetch(proxyServer + swiggyAPI);
            return await response.json();
        }
        catch (error) {
            return rejectWithValue({ message: "Error occurred" })
        }
    })

// time to create the slice here man 

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