import type { Product } from '../types/product'
import { useFavoritesStore } from '../store/favoritesStore'

function formatPrice(price: number): string {
  return `${price.toLocaleString('vi-VN')}đ`
}

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  // Selector chỉ subscribe đúng 1 phần state cần dùng -> tránh re-render thừa
  const isFavorite = useFavoritesStore((state) =>
    state.favoriteIds.includes(product.id),
  )
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  return (
    <li className="product-card">
      <button
        type="button"
        className={`favorite-btn${isFavorite ? ' is-active' : ''}`}
        onClick={() => toggleFavorite(product.id)}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite
            ? `Bỏ yêu thích ${product.name}`
            : `Thêm yêu thích ${product.name}`
        }
      >
        {isFavorite ? '♥' : '♡'}
      </button>
      <div className="product-emoji" aria-hidden="true">
        {product.emoji}
      </div>
      <h3>{product.name}</h3>
      <p className="product-price">{formatPrice(product.price)}</p>
    </li>
  )
}

export default ProductCard
