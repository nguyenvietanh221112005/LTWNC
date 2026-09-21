import { products } from '../data/products'
import { useFavoritesStore } from '../store/favoritesStore'

function FavoritesBar() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const favoriteProducts = products.filter((product) =>
    favoriteIds.includes(product.id),
  )

  return (
    <section className="favorites-bar">
      <h2>Sản phẩm yêu thích ({favoriteProducts.length})</h2>
      {favoriteProducts.length === 0 ? (
        <p>Chưa có sản phẩm yêu thích nào. Bấm ♡ trên sản phẩm để thêm.</p>
      ) : (
        <ul className="favorites-list">
          {favoriteProducts.map((product) => (
            <li key={product.id}>
              {product.emoji} {product.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default FavoritesBar
// So với Redux Toolkit, Zustand cho phép cài đặt tính năng này nhanh hơn nhiều 
// không cần định nghĩa slice, action type, không cần `configureStore` hay bọc `<Provider>` 
// — chỉ 1 file `create<T>()` là đủ để dùng ở mọi component. 
// Việc gọi action (`toggleFavorite(id)`) cũng tự nhiên như gọi hàm bình thường, không cần `dispatch`. 
// Đổi lại, Zustand không có sẵn Redux DevTools time-travel, không có cấu trúc slice chuẩn hoá để nhiều người cùng làm việc trên state lớn, và không có cơ chế `pending/fulfilled/rejected` tự động cho async như `createAsyncThunk`. 
// Với một tính năng nhỏ, độc lập như "yêu thích" thì Zustand phù hợp hơn vì ít boilerplate và hiệu năng tốt (chỉ re-render đúng phần subscribe); 
// nhưng nếu dự án lớn, nhiều slice liên quan chặt chẽ với nhau và cần chuẩn hoá quy trình cho cả team, Redux Toolkit vẫn là lựa chọn an toàn hơn.