import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mobileMenuOpen: false,
    cartDrawerOpen: false,
  },
  reducers: {
    openMobileMenu(state) { state.mobileMenuOpen = true; },
    closeMobileMenu(state) { state.mobileMenuOpen = false; },
    toggleMobileMenu(state) { state.mobileMenuOpen = !state.mobileMenuOpen; },
    openCartDrawer(state) { state.cartDrawerOpen = true; },
    closeCartDrawer(state) { state.cartDrawerOpen = false; },
    toggleCartDrawer(state) { state.cartDrawerOpen = !state.cartDrawerOpen; },
  },
});

export const {
  openMobileMenu, closeMobileMenu, toggleMobileMenu,
  openCartDrawer, closeCartDrawer, toggleCartDrawer,
} = uiSlice.actions;
export default uiSlice.reducer;
