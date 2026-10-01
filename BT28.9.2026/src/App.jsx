import { useState, useMemo, useEffect, useRef } from 'react'
import './App.css'

// 10,000 sản phẩm mẫu
const generateProducts = () => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Food', 'Beauty']
  const products = []
  for (let i = 1; i <= 10000; i++) {
    products.push({
      id: i,
      name: `Product ${i}`,
      category: categories[i % categories.length],
      price: Math.floor(Math.random() * 1000) + 10,
      stock: Math.floor(Math.random() * 100),
      rating: (Math.random() * 5).toFixed(1),
      description: `This is product number ${i} in our store`
    })
  }
  return products
}

const ALL_PRODUCTS = generateProducts()

//  KỸ THUẬT 1: Virtualization - Chỉ render items đang hiển thị 
function VirtualProductList({ products, onSelect }) {
  const containerRef = useRef(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 })

  const itemHeight = 180
  const containerHeight = 600
  const overscan = 5

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const scrollTop = containerRef.current.scrollTop
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
      const visibleCount = Math.ceil(containerHeight / itemHeight)
      const end = Math.min(products.length, start + visibleCount + overscan * 2)
      setVisibleRange({ start, end })
    }

    const container = containerRef.current
    container.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => container.removeEventListener('scroll', handleScroll)
  }, [products.length])

  const totalHeight = products.length * itemHeight
  const visibleProducts = products.slice(visibleRange.start, visibleRange.end)
  const offsetY = visibleRange.start * itemHeight

  return (
    <div
      ref={containerRef}
      className="virtual-list-container"
      style={{ height: containerHeight, overflow: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleProducts.map(product => (
            <div
              key={product.id}
              className="product-item"
              onClick={() => onSelect(product)}
            >
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Rating: ⭐ {product.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

//  KỸ THUẬT 2 useMemo - Cache kết quả filter/sort 
function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [sortBy, setSortBy] = useState('id')
  const [startTime] = useState(Date.now())

  // useMemo: chỉ tính lại khi dependencies thay đổi
  const filteredProducts = useMemo(() => {
    let result = ALL_PRODUCTS

    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter)
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating)
      return a.id - b.id
    })
  }, [searchTerm, categoryFilter, sortBy])

  useEffect(() => {
    const loadTime = Date.now() - startTime
    console.log(`Render time: ${loadTime}ms`)
    localStorage.setItem('optimizedLoadTime', loadTime.toString())
  }, [startTime])

  return (
    <div className="app">
      <header className="header">
        <h1>🛒 Product Management System</h1>
        <p>Displaying {filteredProducts.length.toLocaleString()} products (10,000 total)</p>
        <p className="optimized">✅ OPTIMIZED: useMemo + Virtualization</p>
      </header>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
          <option value="Sports">Sports</option>
          <option value="Toys">Toys</option>
          <option value="Food">Food</option>
          <option value="Beauty">Beauty</option>
        </select>
      </div>

      <div className="sort-controls">
        <label>Sort by: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="id">ID</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <VirtualProductList
        products={filteredProducts}
        onSelect={setSelectedProduct}
      />

      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Price:</strong> ${selectedProduct.price}</p>
            <p><strong>Stock:</strong> {selectedProduct.stock}</p>
            <p><strong>Rating:</strong> ⭐ {selectedProduct.rating}</p>
            <button onClick={() => setSelectedProduct(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
