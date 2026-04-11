// features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from "../Utils/axiosClient";


// Load cart from localStorage
const loadCartFromLocalStorage = () => {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            return JSON.parse(savedCart);
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
    }
    return {
         items: [],
          count: 0,
          guestId: null
         };
};

// Save cart to localStorage
const saveCartToLocalStorage = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify({
            items: cart.items,
            count: cart.count,
            guestId: cart.guestId
        }));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

// Generate guest ID for non-logged in users
const generateGuestId = () => {
    return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};


// Sync local cart with backend after login
export const syncCartAfterLogin = createAsyncThunk(
    'cart/syncAfterLogin',
    async (userId, { getState, rejectWithValue }) => {
        try {
            const { cart } = getState();
            
            const localCart = {
                items: cart.items,
                count: cart.count
            };
            
            const response = await axiosClient.post('api/cart/sync', {
                userId,
                localCart
            });
            console.log("Response from the bacind in sync cart",response);
            return response.data.cart; 
        } 
        catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// Add item to backend cart
export const addItemToBackend = createAsyncThunk(
    'cart/addItemToBackend',
    async ({ userId, product }, { rejectWithValue }) => {
        try {
            console.log("product",product);
            const response = await axiosClient.post('/api/cart/add', {
                userId,
               product
            });
            console.log(response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// Remove item from backend
export const removeItemFromBackend = createAsyncThunk(
    'cart/removeItemFromBackend',
    async ({ userId, itemId }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.delete(`/cart/item/${itemId}`, {
                data: { userId }
            });
            return { itemId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Clear backend cart
export const clearBackendCart = createAsyncThunk(
    'cart/clearBackendCart',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosClient.delete(`/cart/clear/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        ...initialState,
        loading: false,
        error: null,
        synced: true,
        guestId: initialState.guestId || generateGuestId()
    },
    reducers: {

        addItem: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
                
            const filteredData={
                id:action.payload.id,
                name:action.payload.name,
                price:action.payload?.defaultPrice || action.payload?.price,
                image:action.payload.imageId
            }
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...filteredData, quantity: 1 });
            }
            state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.synced = false;

            // Save to localStorage immediately
            saveCartToLocalStorage(state);
        },

        // Increase item quantity
        increaseItem: (state, action) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity += 1;
                state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
                state.synced = false;
                saveCartToLocalStorage(state);
            }
        },

        // Decrease item quantity
        decreaseItem: (state, action) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.items = state.items.filter(i => i.id !== action.payload.id);
                }
                state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
                state.synced = false;
                saveCartToLocalStorage(state);
            }
        },

        // Remove item
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
            state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.synced = false;
            saveCartToLocalStorage(state);
        },

        // Clear cart
        clearCart: (state) => {
            state.items = [];
            state.count = 0;
            state.synced = false;
            saveCartToLocalStorage(state);
        },

        // Mark as synced
        setSynced: (state, action) => {
            state.synced = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Sync cart after login
        builder
            .addCase(syncCartAfterLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(syncCartAfterLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.count = action.payload.count;
                state.synced = true;
                saveCartToLocalStorage(state);
            })
            .addCase(syncCartAfterLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

           
            
             .addCase(addItemToBackend.pending, (state) => {
                // Don't set loading true to avoid UI flicker
                state.error = null;
            })
            .addCase(addItemToBackend.fulfilled, (state, action) => {
                state.synced = true;
                console.log('Item synced to backend successfully');
            })
            .addCase(addItemToBackend.rejected, (state, action) => {
                state.error = action.payload;
                console.error('Failed to sync item to backend:', action.payload);
                // Keep synced = false,
                //  localStorage has the data
                state.synced=false;
            })

            // Remove from backend
            .addCase(removeItemFromBackend.pending, (state) => {
                state.error = null;
            })
            .addCase(removeItemFromBackend.fulfilled, (state) => {
                state.synced = true;
            })
            .addCase(removeItemFromBackend.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Clear backend cart
            .addCase(clearBackendCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(clearBackendCart.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.count = 0;
                state.synced = true;
                saveCartToLocalStorage(state);
            })
            .addCase(clearBackendCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export actions
export const {
    addItem,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
    setSynced,
    clearError
} = cartSlice.actions;

export default cartSlice.reducer;