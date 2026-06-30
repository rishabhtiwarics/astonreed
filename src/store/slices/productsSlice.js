import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

import product1 from '../../assets/img/reed/product_1.png';
import product2 from '../../assets/img/reed/product_2.png';
import product3 from '../../assets/img/reed/product_3.png';
import product4 from '../../assets/img/reed/product_4.png';

const PRODUCTS = [
  { id: 1, name: 'Midnight Elixir', type: 'Eau de Parfum', price: 10750, image: product1, category: 'signature', badge: 'Best Seller' },
  { id: 2, name: 'Velvet Oud', type: 'Eau de Parfum', price: 12390, image: product2, category: 'oud', badge: 'New' },
  { id: 3, name: 'Coastal Breeze', type: 'Eau de Toilette', price: 9870, image: product3, category: 'signature', badge: null },
  { id: 4, name: 'Royal Musk', type: 'Eau de Parfum', price: 11550, image: product4, category: 'royal', badge: null },
  { id: 5, name: 'Amber Noir', type: 'Eau de Parfum', price: 13200, image: product3, category: 'limited', badge: 'Limited' },
  { id: 6, name: 'Saffron Rose', type: 'Eau de Parfum', price: 14800, image: product1, category: 'royal', badge: 'New' },
  { id: 7, name: 'Cedar Woods', type: 'Eau de Cologne', price: 8990, image: product2, category: 'oud', badge: null },
  { id: 8, name: 'Pearl Iris', type: 'Eau de Parfum', price: 15600, image: product4, category: 'limited', badge: 'Limited' },
];

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/product?limit=100');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: PRODUCTS,
    filtered: PRODUCTS,
    activeFilter: 'all',
    loading: false,
  },
  reducers: {
    filterByCategory(state, action) {
      state.activeFilter = action.payload;
      state.filtered = action.payload === 'all'
        ? state.items
        : state.items.filter(p => p.category === action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const products = Array.isArray(action.payload) ? action.payload : PRODUCTS;
        const mapped = products.map(p => ({
          ...p,
          id: p._id || p.id,
          name: p.name || p.title,
          image: p.image || p.images?.[0]?.url,
          category: p.category && typeof p.category === 'object' ? p.category.slug : p.category
        }));
        state.items = mapped;
        state.filtered = state.activeFilter === 'all'
          ? mapped
          : mapped.filter(p => p.category === state.activeFilter);
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { filterByCategory } = productsSlice.actions;
export default productsSlice.reducer;
