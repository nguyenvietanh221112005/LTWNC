import { products } from '../data/products'
import ProductCard from './ProductCard'

function ProductList() {
  return (
    <ul className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  )
}

export default ProductList
