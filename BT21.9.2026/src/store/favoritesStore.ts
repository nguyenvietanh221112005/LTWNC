import { create } from 'zustand'

interface FavoritesState {
  favoriteIds: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
}


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
