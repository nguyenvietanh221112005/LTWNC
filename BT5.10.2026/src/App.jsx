import { useState, useEffect, useMemo } from 'react'
import './App.css'
import { CATEGORIES, filterAndSortProducts } from './products'
import { fetchProducts } from './productsApi.js'

function ProductCard({ product, onSelect }) {
  return (
    <div className="product-item" onClick={() => onSelect(product)}>
      <h3>{product.name}</h3>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      <p>Rating: ⭐ {product.rating}</p>
    </div>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('id')
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    let isMounted = true
    fetchProducts()
      .then((data) => {
        if (!isMounted) return
        setProducts(data)
        setError(null)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err.message || 'Failed to load products')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const visibleProducts = useMemo(
    () => filterAndSortProducts(products, { searchTerm, categoryFilter, sortBy }),
    [products, searchTerm, categoryFilter, sortBy]
  )

  if (loading) {
    return (
      <div className="app">
        <p role="status">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <p role="alert">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🛒 Product Management System</h1>
        <p>Displaying {visibleProducts.length} products</p>
      </header>

      <div className="filters">
        <input
          type="text"
          aria-label="Search products"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          aria-label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="sort-controls">
        <label htmlFor="sortBy">Sort by: </label>
        <select
          id="sortBy"
          aria-label="Sort by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="id">ID</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {visibleProducts.length === 0 ? (
        <p className="empty-state">No products found.</p>
      ) : (
        <div className="product-list">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <p>
              <strong>Category:</strong> {selectedProduct.category}
            </p>
            <p>
              <strong>Price:</strong> ${selectedProduct.price}
            </p>
            <p>
              <strong>Stock:</strong> {selectedProduct.stock}
            </p>
            <p>
              <strong>Rating:</strong> ⭐ {selectedProduct.rating}
            </p>
            <button onClick={() => setSelectedProduct(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
