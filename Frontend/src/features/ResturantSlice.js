import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/Utils/axiosClient";
import { saveToCache,getFromCache } from "@/Utils/CacheManager";


 function  extractRestaurantsFromCards(cards){

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
                console.log('✅ Returning cached restaurant data');
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

// Load more (WITH offset)
export const loadMoreRestaurants = createAsyncThunk(
    'resturant/loadMoreRestaurants',
    async ({ offset }, { rejectWithValue }) => {

        console.log(offset);
        try {
            const response = await axiosClient.get(`api/restaurants?offset=${offset}`);
            return response.data;
        } catch (error) {
            return rejectWithValue({ message: "Error loading more" });
        }
    }
);


 
const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState: {
        data: null,
        allRestaurants: [],
        offset: 0,        // Same as your working code's offset
        hasMore: true,
        loading: false,
        loadingMore: false,
        error: null,
        loadMoreError: null,

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
                state.offset = restaurants.length;  // Same as setOffset(initialRestaurants.length)
                state.loading = false;
                state.cachedAt = Date.now();
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            
            .addCase(loadMoreRestaurants.pending, (state) => {
                state.loadingMore = true;
                state.loadMoreError = null;
            })
            .addCase(loadMoreRestaurants.fulfilled, (state, action) => {
                const newRestaurants = extractRestaurantsFromCards(action.payload?.data?.cards);
                if (!newRestaurants.length) {
                    state.hasMore = false;
                } else {
                    state.allRestaurants = [...state.allRestaurants, ...newRestaurants];
                    state.offset = state.offset + newRestaurants.length;
                }
                state.loadingMore = false;
            })
            .addCase(loadMoreRestaurants.rejected, (state, action) => {
                state.loadMoreError = action.payload;
                state.loadingMore = false;
            });
    }
});

export default restaurantSlice.reducer;