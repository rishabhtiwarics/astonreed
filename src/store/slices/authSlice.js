import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const savedToken = localStorage.getItem('token') || null;

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await api.post('/user/login', { email, password });
      
      const token = data.token;
      const dbUser = data.data;
      const mappedUser = {
        id: dbUser._id,
        name: dbUser.firstName + (dbUser.lastName ? ' ' + dbUser.lastName : ''),
        email: dbUser.email,
        phone: dbUser.phone,
        role: dbUser.role || 'user',
        shippingAddress: dbUser.shippingAddress
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mappedUser));

      return { user: mappedUser, token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password, confirmPassword }, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/user/register', { name, email, password, confirmPassword });
      // Auto login after registration
      return dispatch(loginUser({ email, password })).unwrap();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    token: savedToken,
    isAuthenticated: !!savedUser,
    loading: false,
    error: null
  },
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    loginFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        // User and token are populated via auto-login dispatch return unwrap
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { loginStart, loginSuccess, loginFail, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
