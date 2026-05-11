// features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from "../Utils/axiosClient";
import { createOrder } from '@/features/OrderSlice'

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
// const deleteCartItemInLocalStorage = (itemId) => {
//     try {
//         const raw = localStorage.getItem('cart');
//         let existingCart = [];
//         if (raw) {
//             const parsed = JSON.parse(raw);
//             if (Array.isArray(parsed)) {
//                 existingCart = parsed;
//             } else if (parsed && typeof parsed === 'object') {
//                 // Convert object to array if needed, but better to log and reset
//                 // console.warn('Cart data is not an array, resetting cart');
//                 existingCart = [];
//             }
//         }
//         const updatedCart = existingCart.filter(item => item.itemId !== itemId);
//         localStorage.setItem('cart', JSON.stringify(updatedCart));
//     } catch (error) {
//         console.log("Error while deleting cart item in localStorage: ", error);
//     }
// }

// Generate guest ID for non-logged in users
const generateGuestId = () => {
    return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};


// Sync local cart with backend after login
export const syncCartAfterLogin = createAsyncThunk(
    'cart/syncAfterLogin',
    async ({ syncType }, { getState, rejectWithValue }) => {
        try {
            const { cart } = getState();
            console.log("Sync type", syncType)
            const localCart = {
                items: cart.items.map(item => ({
                    swiggyItemId: item.swiggyItemId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity
                })),
                count: cart.count
            };
          
            const response = await axiosClient.post('api/cart/sync', {
                syncType,
                localCart
            });
     
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
            const response = await axiosClient.post('/api/cart/add', {
                userId,
                product
            });
    
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// Remove item from backend
export const removeItemFromBackend = createAsyncThunk(
    'cart/removeItemBackend',
    async ({ swiggyItemId }, { rejectWithValue }) => {
        try {
            
            const response = await axiosClient.delete(`api/cart/remove/${swiggyItemId}`, {
            });
           
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const updateItemBackend = createAsyncThunk(
    'cart/updateItemBackend',
    async ({ swiggyItemId, quantity }, { rejectWithValue }) => {
        try {
            console.log(swiggyItemId)
            console.log(quantity)
            const response = await axiosClient.patch(`/api/cart/update/${swiggyItemId}`, {
                quantity
            });

    
            return response.data ;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }

)

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
            if (!state.items) {
                state.items = [];

            }
            const existingItem = state.items?.find(item => item.swiggyItemId === action.payload.id);

            console.log("Printing the payload", action.payload)
            const filteredData = {
                swiggyItemId: action.payload.id,
                name: action.payload.name,
                price: action.payload?.defaultPrice || action.payload?.price,
                image: action.payload.imageId
            }
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...filteredData, quantity: 1 });
            }
            state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.synced = false;
            saveCartToLocalStorage(state);
        },

        // Increase item quantity
        increaseItem: (state, action) => {
            const id = action.payload.id || action.payload.swiggyItemId;
            const item = state.items.find(item => item.swiggyItemId === id);
            // const item = state.items.find(item => item.swiggyItemId === action.payload.id);
            if (item) {
                item.quantity += 1;
                state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
                state.synced = false;
                saveCartToLocalStorage(state);
            }
        },

        // Decrease item quantity
        decreaseItem: (state, action) => {

            const id = action.payload.id || action.payload.swiggyItemId;
            const item = state.items.find(item => item.swiggyItemId === id);
            // const item = state.items.find(item => item.swiggyItemId === action.payload.id);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.items = state.items.filter(i => i.swiggyItemId !== id);
                }
                state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
                state.synced = false;
                saveCartToLocalStorage(state);
            }
        },

        // Remove item
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.swiggyItemId !== action.payload.id);
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
                state.error = null;
            })
            .addCase(addItemToBackend.fulfilled, (state, action) => {
                state.synced = true;
            })
            .addCase(addItemToBackend.rejected, (state, action) => {
                state.error = action.payload;
                state.synced = false;
            })

            .addCase(updateItemBackend.pending, (state) => {
                state.error = null;
            })
            .addCase(updateItemBackend.fulfilled, (state) => {
                state.synced = true;
            })
            .addCase(updateItemBackend.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(removeItemFromBackend.pending, (state) => {
                state.error = null;
            })
            .addCase(removeItemFromBackend.fulfilled, (state) => {
                state.synced = true;
            })
            .addCase(removeItemFromBackend.rejected, (state, action) => {
                state.error = action.payload;
            })

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
            })

            .addCase(createOrder.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.items = [];
                    state.count = 0;
                    state.total = 0;
                    state.synced = false;
                    saveCartToLocalStorage(state);
                }
            })
    }
});

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