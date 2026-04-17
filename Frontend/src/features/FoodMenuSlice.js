
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from '../Utils/axiosClient';
import { saveToCache, getFromCache } from "@/Utils/CacheManager";


export const fetchFoodMenu = createAsyncThunk(
    'foodMenu/fetchFoodMenu',
    async (restaurantId, { rejectWithValue }) => {
        const CACHE_URL = `/api/restaurants${restaurantId}`;

        try {

            const cachedData = await getFromCache(CACHE_URL);
            if (cachedData) {
                console.log('✅ Returning cached restaurant data');
                return { restaurantId, data: cachedData };
            }

            const response = await axiosClient.get(`/api/restaurants/${restaurantId}`)

            if (response.status !== 200) {
                throw new Error("Failed to fetch menu");
            }
            await saveToCache(CACHE_URL, response.data);

            return { restaurantId, data: response.data };

        }
        catch (error) {
            return rejectWithValue({ message: error.message })
        }

    }
)

export const foodMenuSlice = createSlice({
    name: 'foodMenu',
    initialState: {
        cache: {},
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
                const { restaurantId, data } = action.payload;
                state.cache[restaurantId] = data;
                state.loading = false;
            })
            .addCase(fetchFoodMenu.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
    }
})
export default foodMenuSlice.reducer;