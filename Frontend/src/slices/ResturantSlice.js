import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/Utils/axiosClient";
import { saveToCache, getFromCache } from "@/Utils/CacheManager";


function extractRestaurantsFromCards(cards) {

    for (const card of cards) {
        const restaurants = card?.card?.card?.gridElements?.infoWithStyle?.restaurants;
        if (restaurants && Array.isArray(restaurants)) {
            return restaurants;
        }
    }
    return [];
};

// Initial fetch (NO offset)
export const fetchRestaurants = createAsyncThunk(
    'resturant/fetchResturant',
    async (_, { rejectWithValue }) => {
        const CACHE_URL = '/api/restaurants';

        try {

            const cachedData = await getFromCache(CACHE_URL);
            if (cachedData) {
                return cachedData;
            }

            const response = await axiosClient.get('api/restaurants');
            await saveToCache(CACHE_URL, response.data);

            return response.data;
        } catch (error) {
            return rejectWithValue({ message: "Error occurred" });
        }
    }
);




const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState: {
        data: null,
        allRestaurants: [],  // Same as your working code's offset
        loading: false,
        error: null,
        cachedAt: null,
    },
    // NO reducers section - no resetRestaurants needed!
    extraReducers: (builder) => {
        builder
            .addCase(fetchRestaurants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.data = action.payload;
                const restaurants = extractRestaurantsFromCards(action.payload?.data?.cards)
                state.allRestaurants = restaurants;
                state.loading = false;
                state.cachedAt = Date.now();
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

    }
});

export default restaurantSlice.reducer;