// features/auth/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../Utils/axiosClient";

// ─── Thunks ───────────────────────────────────────────────

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

export const setAddress = createAsyncThunk(
  'user/setAddress',
  async (address, { rejectWithValue }) => {
    try {

      const response = await axiosClient.patch('api/user/address', address);
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
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {

    // register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })

      // logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })

      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })


      //setAddress
      .addCase(setAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(setAddress.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          if (!state.user.address) {
            state.user.address = [];
          }
          state.user.address.push(action.payload.data);
        }
      })
      .addCase(setAddress.rejected, (state) => {
        state.loading = false;
      })
  },
});

export default userSlice.reducer;