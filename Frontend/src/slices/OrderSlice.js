import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../Utils/axiosClient';
import { fetchFoodMenu } from '../slices/FoodMenuSlice';
import foodDataFormatter from '@/Utils/foodDataFormatter';
import { setCart } from './CartSlice';
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from '@/Utils/Constants';

// export  const FREE_DELIVERY_THRESHOLD = 1000;
// export const DELIVERY_FEE = 67;

// CREATE ORDER
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {

            const response = await axiosClient.post('/api/order', orderData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// GET MY ORDERS
export const getMyOrders = createAsyncThunk(
    'order/getMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get('/api/order');
            return res.data.orders;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// CANCEL ORDER
export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async ({ orderId, reason }, { rejectWithValue }) => {
        try {
            const res = await axiosClient.patch(`/api/order/${orderId}/cancel`, { reason });
            return res.data.order;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);
// export const reorderFromOrder = createAsyncThunk(
//     'order/reorderFromOrder',
//     async (orderId, { dispatch, getState, rejectWithValue }) => {
//         try {
//             // 1. Fetch the order details
//             const orderRes = await axiosClient.get(`/api/order/${orderId}`);
//             const order = orderRes.data.order;

//             console.log(order);

//             // 2. Get unique restaurant IDs
//             const restaurantIdList = [...new Set(order.restaurants.map(r => r.restaurantId))];

//             // 3. Fetch menus for all restaurants
//             const responses = await Promise.all(
//                 restaurantIdList.map((restaurantId) =>
//                     dispatch(fetchFoodMenu(restaurantId)).unwrap()
//                 )
//             );

//             // 4. Process each restaurant and check availability
//             const availableRestaurants = [];
//             const unavailableItems = [];
//             let hasUnavailable = false;

//             for (const pastRestaurant of order.restaurants) {
//                 const menuResponse = responses.find(
//                     resp => resp?.restaurantId === pastRestaurant.restaurantId
//                 );

//                 if (!menuResponse?.data) {
//                     hasUnavailable = true;
//                     unavailableItems.push({
//                         restaurantId: pastRestaurant.restaurantId,
//                         restaurantName: pastRestaurant.restaurantName,
//                         reason: 'Restaurant menu not available'
//                     });
//                     continue;
//                 }

//                 const itemsList = foodDataFormatter(menuResponse.data);
//                 const restaurantAvailableItems = [];
//                 const restaurantUnavailable = [];

//                 for (const pastItem of pastRestaurant.items) {
//                     const foundItem = itemsList.find(
//                         menuItem => menuItem.card?.info?.id === pastItem.swiggyItemId
//                     );

//                     if (foundItem) {
//                         restaurantAvailableItems.push({
//                             swiggyItemId: foundItem.card?.info?.id,
//                             name: foundItem.card?.info?.name,
//                             price: Math.floor(foundItem.card?.info?.price / 100),
//                             quantity: pastItem.quantity || 1,
//                             image: foundItem.card?.info?.imageId,
//                             itemTotal: pastItem.price
//                         });
//                     } else {
//                         hasUnavailable = true;
//                         restaurantUnavailable.push({
//                             swiggyItemId: pastItem.swiggyItemId,
//                             name: pastItem.name,
//                             quantity: pastItem.quantity
//                         });
//                     }
//                 }

//                 if (restaurantUnavailable.length > 0) {
//                     unavailableItems.push({
//                         restaurantId: pastRestaurant.restaurantId,
//                         restaurantName: pastRestaurant.restaurantName,
//                         items: restaurantUnavailable
//                     });
//                 }

//                 if (restaurantAvailableItems.length > 0) {
//                     availableRestaurants.push({
//                         restaurantId: pastRestaurant.restaurantId,
//                         restaurantName: pastRestaurant.restaurantName,
//                         city: pastRestaurant.city,
//                         locality: pastRestaurant.locality,
//                         items: restaurantAvailableItems,
//                         restaurantTotal: restaurantAvailableItems.reduce(
//                             (sum, item) => sum + (item.price * item.quantity), 0
//                         )
//                     });
//                 }
//             }

//             // If ANY item is unavailable, don't proceed
//             if (hasUnavailable) {
//                 return rejectWithValue({
//                     message: 'Some items are no longer available. Cannot reorder.',
//                     unavailableItems: unavailableItems,
//                     canReorderPartial: false
//                 });
//             }

//             // 5. All items available - Create new order in backend
//             const reorderPayload = {
//                 restaurants: availableRestaurants.map(restaurant => ({
//                     restaurantId: restaurant.restaurantId,
//                     restaurantName: restaurant.restaurantName,
//                     city: restaurant.city,
//                     locality: restaurant.locality,
//                     items: restaurant.items.map(item => ({
//                         swiggyItemId: item.swiggyItemId,
//                         name: item.name,
//                         price: item.price,
//                         quantity: item.quantity,
//                         image: item.image,
//                         price: item.price
//                     })),
//                     restaurantTotal: restaurant.restaurantTotal
//                 })),
//                 deliveryAddress: order.deliveryAddress,
//                 deliveryFee: order.deliveryFee,
//                 totalAmount: availableRestaurants.reduce(
//                     (sum, r) => sum + r.restaurantTotal, 0
//                 )
//             };

//             console.log(reorderPayload);

//             // Call backend to create reorder
//             const reorderResponse = await axiosClient.post(`/api/order/${orderId}/reorder`, reorderPayload);

//             console.log(reorderFromOrder.data);

//             return reorderResponse.data;

//         } catch (error) {
//             console.error("Reorder error:", error);
//             return rejectWithValue(error.response?.data || error.message);
//         }
//     }
// );
export const reorderFromOrder = createAsyncThunk(
    'order/reorderFromOrder',
    async (orderId, { dispatch, getState, rejectWithValue }) => {
        try {
            const orderRes = await axiosClient.get(`/api/order/${orderId}`);
            const order = orderRes.data.order;

            const restaurantIdList = order.restaurants.map(
                restaurant => restaurant.restaurantId || restaurant.info // handle both
            );

            const responses = await Promise.all(
                restaurantIdList.map((restaurantId) =>
                    dispatch(fetchFoodMenu(restaurantId))
                )
            );

            const newOrder = [];
            const unavailableItems = [];

            for (let i = 0; i < order.restaurants.length; i++) {
                const pastRestaurant = order.restaurants[i];
                const restaurantId = pastRestaurant.restaurantId || pastRestaurant.info;

                let menuFound = false;
                for (let j = 0; j < responses.length; j++) {
                    if (restaurantId === responses[j]?.payload?.restaurantId) {
                        menuFound = true;
                        const itemsList = foodDataFormatter(responses[j]?.payload?.data);
                        const restaurantItems = [];
                        const restaurantUnavailable = [];

                        for (let k = 0; k < pastRestaurant.items.length; k++) {
                            const pastItem = pastRestaurant.items[k];
                            const foundItem = itemsList.find(
                                menuItem => menuItem.card?.info?.id === pastItem.swiggyItemId
                            );

                            if (foundItem) {

                                const info = foundItem.card?.info;

                                const itemPrice = Math.floor(
                                    (info?.finalPrice ||
                                        info?.price ||
                                        info?.defaultPrice ||
                                        0) / 100
                                );
                                restaurantItems.push({
                                    itemId: foundItem.card?.info?.id,
                                    itemPrice,


                                    name: foundItem.card?.info?.name,
                                    quantity: pastItem.quantity || 1
                                });
                            } else {
                                restaurantUnavailable.push({
                                    itemId: pastItem.swiggyItemId,
                                    name: pastItem.name,
                                    quantity: pastItem.quantity
                                });
                            }
                        }

                        if (restaurantUnavailable.length) {
                            unavailableItems.push({
                                restaurantId: restaurantId,
                                restaurantName: pastRestaurant.restaurantName,
                                items: restaurantUnavailable
                            });
                        }

                        if (restaurantItems.length) {
                            const itemTotal = restaurantItems.reduce(
                                (sum, item) => sum + (item.itemPrice * item.quantity), 0
                            );
                            newOrder.push({
                                restaurantId: restaurantId,
                                restaurantName: pastRestaurant.restaurantName,
                                city: pastRestaurant.city,          // ✅ added city
                                locality: pastRestaurant.locality,
                                items: restaurantItems,
                                itemTotal: itemTotal               // per‑restaurant subtotal
                            });
                        }
                        break;
                    }
                }
                if (!menuFound) {
                    unavailableItems.push({
                        restaurantId: restaurantId,
                        restaurantName: pastRestaurant.restaurantName,
                        reason: 'Menu not available'
                    });
                }
            }

            // ✅ If any item missing → reject
            if (unavailableItems.length > 0) {
                return rejectWithValue({
                    message: 'Some items are no longer available',
                    unavailableItems
                });
            }


            order.restaurants.sort((a, b) => { return Number(a.restaurantId) - Number(b.restaurantId) });
            newOrder.sort((a, b) => { return Number(a.restaurantId) - Number(b.restaurantId) })

            for (let i = 0; i < order.restaurants.length; i++) {

                if (order.restaurants[i].restaurantId === newOrder[i].restaurantId) {

                    for (let j = 0; j < order.restaurants[i].items.length; j++) {

                        if (order.restaurants[i].items[j].swiggyItemId === newOrder[i].items[j].itemId) {
                            order.restaurants[i].items[j].price = newOrder[i].items[j].itemPrice
                        }
                    }
                }
            }

            let itemTotal = 0;
            for (let i = 0; i < order.restaurants.length; i++) {
                for (let j = 0; j < order.restaurants[i].items.length; j++) {

                    const item = order.restaurants[i].items[j];

                    const qty = item.quantity || 0;
                    const price = item.price || 0;

                    itemTotal += qty * price;
                }
            }
            let deliveryFee = DELIVERY_FEE
            if (itemTotal >= FREE_DELIVERY_THRESHOLD) {
                deliveryFee = 0;
            }

            const reorderPayload = {
                restaurants: [],
                itemTotal: itemTotal,
                deliveryFee: deliveryFee
            }
            // console.log(reorderPayload);
            reorderPayload.restaurants.push(...order.restaurants)
            // console.log(reorderPayload)
            const reorderResponse = await axiosClient.post(`/api/order/${orderId}/reorder`, reorderPayload);
            return reorderResponse.data;

        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        loading: false,
        error: null,
        ordersFetched: false,
    },
    reducers: {
        clearOrderError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder

            // CREATE ORDER
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                // console.log("Payload Here in the Order Slice",action.payload)
                state.orders.push(action.payload.data);
                state.ordersFetched = false;

            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET MY ORDERS
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.ordersFetched = true;

            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CANCEL ORDER
            .addCase(cancelOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })

            //reorder case 
            .addCase(reorderFromOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(reorderFromOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(reorderFromOrder.rejected, (state, action) => {
                state.loading = false;
                state.err = action.payload;
            })
    }
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;