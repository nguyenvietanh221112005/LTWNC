import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../products/productsSlice'

export interface CartItem extends Product { quantity: number }

interface CartState { items: CartItem[] }

const initialState: CartState = { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) existingItem.quantity += 1
      else state.items.push({ ...action.payload, quantity: 1 })
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload.id)
      if (!item) return
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((cartItem) => cartItem.id !== action.payload.id)
        return
      }
      item.quantity = action.payload.quantity
    },
    clearCart: (state) => { state.items = [] },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer