import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { addToCart, clearCart, removeFromCart, updateQuantity } from './features/cart/cartSlice'
import { fetchProducts } from './features/products/productsSlice'
import './App.css'

const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'USD' })

function App() {
  const dispatch = useAppDispatch()
  const products = useAppSelector((state) => state.products)
  const cartItems = useAppSelector((state) => state.cart.items)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  useEffect(() => {
    if (products.status === 'idle') void dispatch(fetchProducts())
  }, [dispatch, products.status])

  return (
    <main className="store-shell">
      <header className="store-header">
        <div><p className="eyebrow">REDUX TOOLKIT / BÀI THỰC HÀNH</p><h1>Daily goods</h1><p className="subtitle">Những món đồ nhỏ làm ngày thường dễ chịu hơn.</p></div>
        <div className="cart-summary"><span className="cart-icon" aria-hidden="true">◒</span><span><strong>{cartCount}</strong> sản phẩm</span><b>{currency.format(cartTotal)}</b></div>
      </header>
      <div className="store-layout">
        <section className="catalog" aria-labelledby="catalog-title">
          <div className="section-heading"><div><p className="eyebrow">CỬA HÀNG</p><h2 id="catalog-title">Sản phẩm nổi bật</h2></div><span className="product-count">{products.items.length} món</span></div>
          {products.status === 'loading' && <p className="state-message">Đang chuẩn bị sản phẩm...</p>}
          {products.status === 'failed' && <div className="state-message error"><p>{products.error}</p><button type="button" onClick={() => void dispatch(fetchProducts())}>Thử lại</button></div>}
          {products.status === 'succeeded' && <div className="product-grid">{products.items.map((product) => <article className="product-card" key={product.id}>
            <div className="product-image-wrap"><img src={product.thumbnail} alt={product.title} className="product-image" /><span className="category">{product.category}</span></div>
            <div className="product-info"><h3>{product.title}</h3><p className="rating">★ {product.rating.rate} <span>({product.rating.count})</span></p><div className="product-footer"><strong>{currency.format(product.price)}</strong><button type="button" className="add-button" onClick={() => dispatch(addToCart(product))}>Thêm vào giỏ</button></div></div>
          </article>)}</div>}
        </section>
        <aside className="cart-panel" aria-labelledby="cart-title">
          <div className="cart-heading"><div><p className="eyebrow">ĐƠN HÀNG CỦA BẠN</p><h2 id="cart-title">Giỏ hàng</h2></div>{cartItems.length > 0 && <button type="button" className="clear-button" onClick={() => dispatch(clearCart())}>Xoá hết</button>}</div>
          {cartItems.length === 0 ? <div className="empty-cart"><span aria-hidden="true">□</span><p>Giỏ hàng đang trống</p><small>Chọn một món bạn thích để bắt đầu.</small></div> : <>
            <div className="cart-items">{cartItems.map((item) => <div className="cart-item" key={item.id}><img src={item.thumbnail} alt="" /><div className="cart-item-content"><div className="cart-item-title"><h3>{item.title}</h3><button type="button" aria-label={`Xoá ${item.title}`} onClick={() => dispatch(removeFromCart(item.id))}>×</button></div><strong>{currency.format(item.price * item.quantity)}</strong><div className="quantity-control"><button type="button" aria-label="Giảm số lượng" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>−</button><span>{item.quantity}</span><button type="button" aria-label="Tăng số lượng" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button></div></div></div>)}</div>
            <div className="cart-total"><span>Tạm tính</span><strong>{currency.format(cartTotal)}</strong></div><button type="button" className="checkout-button">Thanh toán <span>→</span></button>
          </>}
        </aside>
      </div>
    </main>
  )
}

export default App
