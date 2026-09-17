import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  thumbnail: string
  rating: { rate: number; count: number }
}

interface ProductsState {
  items: Product[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductsState = { items: [], status: 'idle', error: null }

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async () => {
    const response = await fetch('https://dummyjson.com/products?limit=12')
    if (!response.ok) throw new Error('Không thể tải danh sách sản phẩm.')
    const data: { products: Product[] } = await response.json()
    return data.products
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Đã xảy ra lỗi không xác định.'
      })
  },
})

export default productsSlice.reducer