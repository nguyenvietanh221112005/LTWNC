# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Bài tập: Sản phẩm yêu thích (Zustand)

Tính năng thêm/bỏ sản phẩm khỏi danh sách yêu thích được cài đặt bằng **Zustand store riêng** (`src/store/favoritesStore.ts`), tách biệt hoàn toàn khỏi `cartStore`.

- `useFavoritesStore` lưu `favoriteIds: string[]` và action `toggleFavorite`.
- Mỗi `ProductCard` chỉ subscribe đúng phần state cần dùng qua selector (`state => state.favoriteIds.includes(id)`), nên bấm yêu thích 1 sản phẩm không làm các sản phẩm khác re-render.
- `FavoritesBar` lọc danh sách sản phẩm yêu thích trực tiếp từ `favoriteIds` để hiển thị.

### Nhận xét so sánh với Redux Toolkit

So với Redux Toolkit, Zustand cho phép cài đặt tính năng này nhanh hơn nhiều: không cần định nghĩa slice, action type, không cần `configureStore` hay bọc `<Provider>` — chỉ 1 file `create<T>()` là đủ để dùng ở mọi component. Việc gọi action (`toggleFavorite(id)`) cũng tự nhiên như gọi hàm bình thường, không cần `dispatch`. Đổi lại, Zustand không có sẵn Redux DevTools time-travel, không có cấu trúc slice chuẩn hoá để nhiều người cùng làm việc trên state lớn, và không có cơ chế `pending/fulfilled/rejected` tự động cho async như `createAsyncThunk`. Với một tính năng nhỏ, độc lập như "yêu thích" thì Zustand phù hợp hơn vì ít boilerplate và hiệu năng tốt (chỉ re-render đúng phần subscribe); nhưng nếu dự án lớn, nhiều slice liên quan chặt chẽ với nhau và cần chuẩn hoá quy trình cho cả team, Redux Toolkit vẫn là lựa chọn an toàn hơn.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
