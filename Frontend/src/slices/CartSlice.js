// features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from "../Utils/axiosClient";
import { createOrder } from '@/slices/OrderSlice'

// Load cart from localStorage
const loadCartFromLocalStorage = () => {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsed = JSON.parse(savedCart);
            return {
                restaurants: parsed.restaurants || [],
                count: parsed.count || 0,
                guestId: parsed.guestId || null
            };
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
    }
    return {
        restaurants: [],
        count: 0,
        guestId: null
    };
};

// Save cart to localStorage
const saveCartToLocalStorage = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify({
            restaurants: cart.restaurants,
            count: cart.count,
            guestId: cart.guestId
        }));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

// Generate guest ID
const generateGuestId = () => {
    return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Async thunks for backend sync
export const syncCartAfterLogin = createAsyncThunk(
    'cart/syncAfterLogin',
    async ({ syncType }, { getState, rejectWithValue }) => {
        try {
    
            const { cart } = getState();
            const localCart = {
                restaurants: cart.restaurants,
                count: cart.count
            };

                const response = await axiosClient.post('/api/cart/sync', {
                syncType,
                localCart
            });

            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get(`/api/cart/${userId}`);
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateItemBackend = createAsyncThunk(
    'cart/updateItemBackend',
    async ({ restaurantId, quantity, swiggyItemId }, { rejectWithValue }) => {
        try {

        
            const response = await axiosClient.patch(`/api/cart/item/${swiggyItemId}`, {
                quantity,
                restaurantId
            });
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const removeItemFromBackend = createAsyncThunk(
    'cart/removeItemFromBackend',
    async (groupedByRestaurant, { rejectWithValue }) => {
        try {
       
            const response = await axiosClient.delete(`/api/cart/selectedItems`, {
                data: { items: groupedByRestaurant }
            });
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const clearCartBackend = createAsyncThunk(
    'cart/clearCartBackend',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.delete('/api/cart/clear');
            return response.data.cart;
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
        // Add item to cart (supports multiple restaurants)
        addItem: (state, action) => {
            const { item, restaurant } = action.payload;

            
            // Validate required fields
            const restaurantId = restaurant.id || restaurant.restaurantId;
            if (!restaurantId || !item?.id) {
                console.error('Missing required ids', { restaurant, item });
                return;
            }

            // Find restaurant by its unique ID
            let restaurantGroup = state.restaurants.find(
                r => r.restaurantId === restaurantId   // ✅ correct comparison
            );

            if (!restaurantGroup) {
                // Create new restaurant group
                restaurantGroup = {
                    restaurantId: restaurantId,
                    restaurantName: restaurant.restaurantName ,
                    city: restaurant.city,
                    locality: restaurant.locality ,
                    items: []
                };
                state.restaurants.push(restaurantGroup);
            }

            // Find or create item inside this restaurant
            const existingItem = restaurantGroup.items.find(
                i => i.swiggyItemId === item.id
            );

            const newItem = {
                swiggyItemId: item.id,
                name: item.name || 'Unnamed',
                price: item.defaultPrice || item.price || 0,
                image: item.imageId || item.image || '',
                quantity: 1
            };

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                restaurantGroup.items.push(newItem);
            }

            // Recalculate total count (optional, can also rely on pre-save)
            state.count = state.restaurants.reduce(
                (total, r) => total + r.items.reduce((sum, i) => sum + i.quantity, 0), 0
            );

            state.synced = false;
            saveCartToLocalStorage(state);
        },

        // Increase item quantity
        increaseItem: (state, action) => {
            const { restaurantId, swiggyItemId } = action.payload;
            const restaurant = state.restaurants.find(r => r.restaurantId === restaurantId);
            if (restaurant) {
                const item = restaurant.items.find(i => i.swiggyItemId === swiggyItemId);
                if (item) {
                    item.quantity += 1;
                    state.count = state.restaurants.reduce((total, r) =>
                        total + r.items.reduce((sum, i) => sum + i.quantity, 0), 0
                    );
                    state.synced = false;
                    saveCartToLocalStorage(state);
                }
            }
        },

        // Decrease item quantity
        decreaseItem: (state, action) => {
            const { restaurantId, swiggyItemId } = action.payload;

            const restaurantIndex = state.restaurants.findIndex(r => r.restaurantId === restaurantId);
            if (restaurantIndex !== -1) {
                const restaurant = state.restaurants[restaurantIndex];
                const itemIndex = restaurant.items.findIndex(i => i.swiggyItemId === swiggyItemId);

                if (itemIndex !== -1) {
                    const item = restaurant.items[itemIndex];
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        // Remove item
                        restaurant.items.splice(itemIndex, 1);

                        // Remove restaurant if no items left
                        if (restaurant.items.length === 0) {
                            state.restaurants.splice(restaurantIndex, 1);
                        }
                    }

                    state.count = state.restaurants.reduce((total, r) =>
                        total + r.items.reduce((sum, i) => sum + i.quantity, 0), 0
                    );
                    state.synced = false;
                    saveCartToLocalStorage(state);
                }
            }
        },

        // Remove entire item
        removeItem: (state, action) => {
            const { restaurantId, swiggyItemId } = action.payload;

            const restaurantIndex = state.restaurants.findIndex(r => r.restaurantId === restaurantId);
            if (restaurantIndex !== -1) {
                const restaurant = state.restaurants[restaurantIndex];
                restaurant.items = restaurant.items.filter(i => i.swiggyItemId !== swiggyItemId);

                // Remove restaurant if no items left
                if (restaurant.items.length === 0) {
                    state.restaurants.splice(restaurantIndex, 1);
                }

                state.count = state.restaurants.reduce((total, r) =>
                    total + r.items.reduce((sum, i) => sum + i.quantity, 0), 0
                );
                state.synced = false;
                saveCartToLocalStorage(state);
            }
        },

        // Clear entire cart
        clearCart: (state) => {
            state.restaurants = [];
            state.count = 0;
            state.synced = false;
            saveCartToLocalStorage(state);
        },

        // Clear specific restaurant's items
        clearRestaurantCart: (state, action) => {
            const restaurantId = action.payload;
            state.restaurants = state.restaurants.filter(r => r.restaurantId !== restaurantId);
            state.count = state.restaurants.reduce((total, r) =>
                total + r.items.reduce((sum, i) => sum + i.quantity, 0), 0
            );
            state.synced = false;
            saveCartToLocalStorage(state);
        },

        // Set cart from backend
        setCart: (state, action) => {
            state.restaurants = action.payload.restaurants || [];
            state.count = action.payload.count || 0;
            state.synced = true;
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
                state.restaurants = action.payload.restaurants;
                state.count = action.payload.count;
                state.synced = true;
                saveCartToLocalStorage(state);
            })
            .addCase(syncCartAfterLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.restaurants = action.payload.restaurants;
                state.count = action.payload.count;
                saveCartToLocalStorage(state);
            })
            .addCase(updateItemBackend.fulfilled, (state, action) => {
                state.restaurants = action.payload.restaurants;
                state.count = action.payload.count;
                state.synced = true;
                saveCartToLocalStorage(state);
            })
            .addCase(removeItemFromBackend.fulfilled, (state, action) => {
                state.restaurants = action.payload.restaurants;
                state.count = action.payload.count;
                state.synced = true;
                saveCartToLocalStorage(state);
            })
            .addCase(clearCartBackend.fulfilled, (state, action) => {
                state.restaurants = [];
                state.count = 0;
                state.synced = true;
                saveCartToLocalStorage(state);
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.restaurants = [];
                    state.count = 0;
                    state.synced = false;
                    saveCartToLocalStorage(state);
                }
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
    clearRestaurantCart,
    setCart,
    setSynced
} = cartSlice.actions;

// Selectors
export const selectCartRestaurants = (state) => state.cart.restaurants;
export const selectCartCount = (state) => state.cart.count;
export const selectCartTotal = (state) => {
    return state.cart.restaurants.reduce((total, restaurant) =>
        total + restaurant.items.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0
        ), 0
    );
};
export const selectRestaurantCartTotal = (state, restaurantId) => {
    const restaurant = state.cart.restaurants.find(r => r.restaurantId === restaurantId);
    if (!restaurant) return 0;
    return restaurant.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};
export const selectCartHasItems = (state) => state.cart.count > 0;
export const selectCartRestaurantIds = (state) => state.cart.restaurants.map(r => r.restaurantId);
export const selectIsItemInCart = (state, restaurantId, swiggyItemId) => {
    const restaurant = state.cart.restaurants.find(r => r.restaurantId === restaurantId);
    if (!restaurant) return false;
    return restaurant.items.some(i => i.swiggyItemId === swiggyItemId);
};
export const selectItemQuantity = (state, restaurantId, swiggyItemId) => {
    const restaurant = state.cart.restaurants.find(r => r.restaurantId === restaurantId);
    if (!restaurant) return 0;
    const item = restaurant.items.find(i => i.swiggyItemId === swiggyItemId);
    return item ? item.quantity : 0;
};

export default cartSlice.reducer;