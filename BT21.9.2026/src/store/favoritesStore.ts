import { create } from 'zustand'

interface FavoritesState {
  favoriteIds: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

// Store riêng cho tính năng yêu thích, không gộp chung với cartStore
// (khác trách nhiệm: giỏ hàng lưu số lượng/thanh toán, yêu thích chỉ đánh dấu id).
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: [],
  toggleFavorite: (productId) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.includes(productId)
        ? state.favoriteIds.filter((id) => id !== productId)
        : [...state.favoriteIds, productId],
    })),
  isFavorite: (productId) => get().favoriteIds.includes(productId),
}))
