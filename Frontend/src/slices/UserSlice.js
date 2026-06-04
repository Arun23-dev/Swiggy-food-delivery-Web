// features/auth/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../Utils/axiosClient";


export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {

      const response = await axiosClient.post('/api/user/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {

      const response = await axiosClient.post('/api/user/login', userData);
      return response.data;
    }
    catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/api/user/logout');
      return response.data;
    }
    catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (_, { rejectWithValue }) => {
    try {

    }
    catch (error) {
      return rejectWithValue({ message: error.message });

    }
  }
)


export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {

      const response = await axiosClient.get('/api/user/me',
        {
          params: {
            '_cb': Math.random().toString(36).substring(7),
            '_t': Date.now(),
          }
        }

      );
      if (response.data && response.data.success === false) {
        return rejectWithValue(response.data.message);
      }

      return response.data;
    }
    catch (error) {

      if (error.response?.data) {

        return rejectWithValue(error.response.data.message || error.response.data);
      } else if (error.message) {

        return rejectWithValue(error.message);
      }
      return rejectWithValue("Authentication failed");
    }
  }
);
export const addAddress = createAsyncThunk(
  'user/addAddress',
  async (address, { rejectWithValue }) => {
    try {

      const response = await axiosClient.post('api/user/address', address);
      return response.data;
    }
    catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
)
export const deleteAddress = createAsyncThunk(
  'user/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete(`/api/user/address/${addressId}`);
      return response.data;
    }
    catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);
export const updateAddress = createAsyncThunk(
  'user/updateAddress',
  async ({ addressId, addressData }, { rejectWithValue }) => {
    try {
      console.log("Api before hitting the of the update address man", addressId, addressData)
      const response = await axiosClient.put(`/api/user/address/${addressId}`, addressData);
      console.log("Response after hitting the address man", response.data);
      return response.data;
    }
    catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);
export const setDefaultAddress = createAsyncThunk(
  'user/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch(`/api/user/address/${addressId}/default`);
      console.log(response.data);
      return response.data;
    }
    catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);


export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch('/api/user/profile', profileData);
      return response.data;
    }
    catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);
export const getMyPayments = createAsyncThunk(
  'user/getMyPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('api/payment');

      return response.data;

    }
    catch (error) {
      return rejectWithValue({ message: error.message });
    }

  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
    authLoading: true,
    paymentLoading: true,
    addressLoading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {


    builder
      .addCase(registerUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
        state.user = null;
      })

      // logout
      .addCase(logoutUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.authLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
        state.user = null;
      })

      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      //addAddress
      .addCase(addAddress.pending, (state) => {
        state.addressLoading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        if (state.user) {
          if (!state.user.address) {
            state.user.address = [];
          }
          state.user.address = [];
          state.user.address.push(...action.payload.data.allAddress);
        }
      })
      .addCase(addAddress.rejected, (state) => {
        state.addressLoading = false;
        state.error = action.payload;
      })
      .addCase(updateAddress.pending, (state) => {
        state.addressLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        if (state.user) {
          if (!state.user.address) {
            state.user.address = [];
          }
          state.user.address = [];
          console.log(action.payload.data);
          state.user.address.push(...action.payload.data);
        }

      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.error = action.payload;
      })

      // Delete Address
      .addCase(deleteAddress.pending, (state) => {
        state.addressLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        if (state.user) {
          if (!state.user.address) {
            state.user.address = [];
          }
          state.user.address = [];
          state.user.address.push(...action.payload.allAddress);
        }
      })

      .addCase(deleteAddress.rejected, (state, action) => {
        state.addressLoading = false;
        state.error = action.payload;
      })

      // Set Default Address
      .addCase(setDefaultAddress.pending, (state) => {
        state.addressLoading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addressLoading = false;
        if (state.user && state.user.address) {
          const defaultAddressId = action.payload.addressId;

          // Update all addresses: set the selected one as default, others as false
          state.user.address = state.user.address.map(addr => ({
            ...addr,
            isDefault: addr._id === defaultAddressId
          }));
        }
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyPayments.pending, (state) => {
        state.paymentLoading = true;
      })
      .addCase(getMyPayments.fulfilled, (state, action) => {
        state.paymentLoading = false;
        if (state.user) {
          state.user.payment = action.payload.data;

        }
      })
      .addCase(getMyPayments.rejected, (state) => {
        state.paymentLoading = false;

      })


  },
});

export default userSlice.reducer;