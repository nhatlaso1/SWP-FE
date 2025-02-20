import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    // ... other reducers
  }
});

export const { addProduct, setProducts } = productSlice.actions;
export default productSlice.reducer; 