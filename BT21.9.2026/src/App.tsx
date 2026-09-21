import FavoritesBar from './components/FavoritesBar'
import ProductList from './components/ProductList'
import './App.css'

function App() {
  return (
    <section id="shop">
      <header className="shop-header">
        <h1>Sản phẩm yêu thích</h1>
      </header>

      <FavoritesBar />
      <ProductList />
    </section>
  )
}

export default App
