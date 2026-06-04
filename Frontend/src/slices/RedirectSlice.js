import { createSlice } from '@reduxjs/toolkit';

const redirectSlice = createSlice({
  name: 'redirect',
  initialState: {
    redirectURL: null,
  },
  reducers: {
    setRedirectURL: (state, action) => {
      state.redirectURL = action.payload;
    },
    clearRedirectURL: (state) => {
      state.redirectURL = null;
    },
  },
});

export const { setRedirectURL, clearRedirectURL } = redirectSlice.actions;
export default redirectSlice.reducer;