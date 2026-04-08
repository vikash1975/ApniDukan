import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCart, addToCart, removeFromCart, updateCartQuantity } from '../services/api';

// Async thunks for cart operations
export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await addToCart({ productId, quantity });
      console.log('=== ADD TO CART REDUX DEBUG ===');
      console.log('Adding to cart:', { productId, quantity });
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Add to cart error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      console.log('=== REMOVE FROM CART REDUX DEBUG ===');
      console.log('Removing product ID:', productId);
      const response = await removeFromCart(productId);
      console.log('Remove API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Remove from cart error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      console.log('=== UPDATE QUANTITY REDUX DEBUG ===');
      console.log('Updating product ID:', productId, 'to quantity:', quantity);
      const response = await updateCartQuantity(productId, { quantity });
      console.log('Update quantity API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update quantity error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
    }
  }
);

const initialState = {
  cart: { items: [] },
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearCart: (state) => {
      state.cart = { items: [] };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
.addCase(fetchCartAsync.fulfilled, (state, action) => {
  state.loading = false;
  state.cart = action.payload.cart || action.payload;
})

      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload?.cart || { items: [] };
        state.error = null;
        console.log('=== ADD TO CART FULFILLED ===');
        console.log('Action payload:', action.payload);
        console.log('Updated cart state:', state.cart);
      })

      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCartAsync.pending, (state) => {
        // Don't set loading to true to avoid hiding cart
        state.error = null;
      })
    .addCase(removeFromCartAsync.fulfilled, (state, action) => {
  state.loading = false;
  state.cart = action.payload?.cart || { items: [] };
  state.error = null;
  console.log('=== REMOVE FROM CART FULFILLED ===');
  console.log('Action payload:', action.payload);
  console.log('Updated cart state:', state.cart);
})
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update quantity
      .addCase(updateQuantityAsync.pending, (state) => {
        // Don't set loading to true to avoid hiding cart
        state.error = null;
      })
  .addCase(updateQuantityAsync.fulfilled, (state, action) => {
  state.loading = false;
  state.cart = action.payload?.cart || { items: [] };
  state.error = null;
  console.log('=== UPDATE QUANTITY FULFILLED ===');
  console.log('Action payload:', action.payload);
  console.log('Updated cart state:', state.cart);
})
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCart, setLoading, setError, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
