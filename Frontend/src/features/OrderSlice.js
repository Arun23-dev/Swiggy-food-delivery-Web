import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../Utils/axiosClient';

// CREATE ORDER
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const res = await axiosClient.post('/api/order/create', orderData);
            return res.data;
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
            const res = await axiosClient.get('/api/orders/my-orders');
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
            const res = await axiosClient.patch(`/api/orders/${orderId}/cancel`, { reason });
            return res.data.order;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        loading: false,
        error: null,
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
            console.log("Payload Here ",action.payload)
            state.orders.push(action.payload);
        
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
        });
    }
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;