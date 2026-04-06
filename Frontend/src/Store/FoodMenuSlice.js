
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const fetchFoodMenu = createAsyncThunk(
    'foodMenu/fetchFoodMenu',
    async (restaurantId, { rejectWithValue }) => {

        try {
            const proxyServer = "https://cors-anywhere.herokuapp.com/";
            const swiggyAPI = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${restaurantId}&catalog_qa=undefined&submitAction=ENTER`;


            const response = await fetch(proxyServer + swiggyAPI);

            if (!response.ok) {
                throw new Error("Failed to fetch menu");
            }
            const data=await response.json();
            return {restaurantId,data};
 
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