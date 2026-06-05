import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false, loading: false, error: null },
  reducers: {
    loginStart(state) { state.loading = true; state.error = null; },
    loginSuccess(state, action) { state.loading = false; state.user = action.payload; state.isAuthenticated = true; },
    loginFail(state, action) { state.loading = false; state.error = action.payload; },
    logout(state) { state.user = null; state.isAuthenticated = false; },
    registerSuccess(state, action) { state.user = action.payload; state.isAuthenticated = true; },
    clearError(state) { state.error = null; },
  },
});

export const { loginStart, loginSuccess, loginFail, logout, registerSuccess, clearError } = authSlice.actions;
export default authSlice.reducer;
