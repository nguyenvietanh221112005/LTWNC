# Báo cáo — NextAuth, Middleware RBAC & SEO nâng cao

Dự án: `BT19.10.2026` (Next.js 15, App Router, TypeScript)
Phạm vi: tích hợp NextAuth (Auth.js v5) với Google OAuth + Credentials,
phân quyền 2 vai trò (`admin`, `user`) qua Middleware + Server
Component + Server Action, và SEO nâng cao cho 3 trang công khai
(`/`, `/products`, `/products/[id]`).

## 1. Sơ đồ các lớp bảo vệ (defense in depth)

```
 Trình duyệt
     │  GET/POST /dashboard, /admin, Server Action
     ▼
┌─────────────────────────────────────────────────────────┐
│ LỚP 1 — Middleware (middleware.ts, auth.config.ts)       │
│  matcher: /dashboard/:path*, /admin/:path*                │
│  • Chưa đăng nhập            → redirect /login             │
│  • Vào /admin nhưng role≠admin → redirect /403              │
│  Chạy ở Edge Runtime, chỉ đọc JWT cookie — kiểm tra NHẸ,    │
│  không truy vấn DB/bcrypt.                                 │
└─────────────────────────────────────────────────────────┘
     │ (đi qua)
     ▼
┌─────────────────────────────────────────────────────────┐
│ LỚP 2 — Page / Server Component                           │
│  app/dashboard/page.tsx, app/admin/page.tsx                │
│  await auth(); không có session → redirect('/login');      │
│  role không đủ → redirect('/403'). Tự kiểm tra lại dù       │
│  Middleware đã chặn — vì layout không re-render khi          │
│  chuyển trang con, không thể chỉ kiểm tra ở layout.         │
└─────────────────────────────────────────────────────────┘
     │ (gửi form tới Server Action)
     ▼
┌─────────────────────────────────────────────────────────┐
│ LỚP 3 — Server Action                                      │
│  app/admin/actions.ts: deleteProductAction                 │
│  Server Action là ENDPOINT CÔNG KHAI — ai biết reference    │
│  cũng gọi được, không chỉ qua nút trên giao diện.           │
│  • auth() + can(role, 'product:write') lại — không tin UI    │
│  • Validate input bằng zod trước khi chạm dữ liệu           │
└─────────────────────────────────────────────────────────┘
     │ (đã qua kiểm tra quyền + dữ liệu hợp lệ)
     ▼
┌─────────────────────────────────────────────────────────┐
│ LỚP 4 — Tầng dữ liệu                                        │
│  lib/products.ts: deleteProductById                         │
│  Không tự kiểm tra quyền lần nữa (đã được LỚP 3 xác nhận) — │
│  chỉ thao tác trên id đã validate. Trong dự án thật, tầng    │
│  này sẽ lọc thêm theo userId, không tin id gửi từ client.    │
└─────────────────────────────────────────────────────────┘
```

**File tương ứng theo chức năng RBAC:**

| File | Vai trò |
| --- | --- |
| `auth.config.ts` | Cấu hình nhẹ (Edge-safe): `pages`, `callbacks.authorized`, `callbacks.jwt/session` dùng chung cho cả Middleware lẫn `auth.ts` |
| `auth.ts` | Cấu hình đầy đủ: provider Google + Credentials (bcrypt), `session: { strategy: 'jwt' }` |
| `middleware.ts` | Lớp 1 — `NextAuth(authConfig).auth`, `matcher` |
| `types/next-auth.d.ts` | Module augmentation: `Session.user.role`, `JWT.role` kiểu `"admin" \| "user"` (không `any`) |
| `lib/permissions.ts` | Ma trận `can(role, action)` dùng chung ở page và Server Action |
| `app/admin/actions.ts` | Lớp 3 — Server Action re-check quyền + `zod` |

## 2. Ma trận phân quyền (role × action)

| Hành động | user | admin |
| --- | :---: | :---: |
| Sửa/xoá sản phẩm (`product:write`) | ✕ | ✓ |
| Quản lý người dùng (`user:manage`) | ✕ | ✓ |


## 3. Kiểm thử thực tế 

| Kịch bản | Kết quả |
| --- | --- |
| Khách (chưa đăng nhập) gọi `GET /dashboard` | `307 → /login?callbackUrl=...` |
| Khách gọi `GET /admin` | `307 → /login?callbackUrl=...` |
| Đăng nhập Credentials (`user@shop.vn`) rồi vào `/dashboard` | `200 OK` |
| `user@shop.vn` vào `/admin` | `302 → /403` (chặn bởi Middleware) |
| Đăng nhập Credentials (`admin@shop.vn`) rồi vào `/admin` | `200 OK`, thấy danh sách user + sản phẩm |
| Admin submit form "Xoá" (Server Action `deleteProductAction`) | Sản phẩm bị xoá khỏi danh sách ngay (revalidatePath) |
| `user@shop.vn` POST thẳng tới `/admin` (mô phỏng submit form xoá) | Middleware chặn trước, `302 → /403`; dữ liệu không đổi |

## 4. SEO 

| Thẻ | Trước (baseline, chỉ có title/description mặc định của layout) | Sau (hiện tại) |
| --- | --- | --- |
| `<title>` | "My Shop — Cửa hàng thể thao" (dùng chung mọi trang) | Theo từng trang: "Giày chạy bộ Pro \| My Shop" |
| `<link rel="canonical">` | — (không có) | `http://localhost:8000/products/1` |
| `<meta property="og:*">` | — (không có) | `og:title`, `og:description`, `og:image` (1200×630, PNG sinh động) |
| `<script type="application/ld+json">` | — (không có) | JSON-LD `Product` + `Offer` (giá, tình trạng còn hàng) trên trang chi tiết; JSON-LD `Organization` trên trang chủ |

Đã kiểm tra bằng `curl` trực tiếp vào HTML server trả về (tương đương
"View page source" mà bot tìm kiếm thấy, không phải tab Elements đã chạy
JS) — toàn bộ thẻ trên nằm sẵn trong HTML vì `/`, `/products`,
`/products/[id]` vẫn là SSG/ISR (xem bảng route bên dưới), không bị kéo
thành trang động chỉ vì có đăng nhập (xem mục 5).

## 5. Lighthouse — trước/sau 

"Trước" = bản baseline chỉ có `<title>`/`<meta description>` mặc định từ
root layout, **không** có canonical/openGraph/JSON-LD/opengraph-image.
"Sau" = bản hiện tại (đầy đủ SEO nâng cao).

| Trang | | Performance | SEO | Best&nbsp;Practices | LCP | FCP |
| --- | --- | :---: | :---: | :---: | :---: | :---: |
| `/products/1` | Trước | 100 | 100 | 100 | 1.7 s | 0.8 s |
| `/products/1` | Sau | 100 | 100 | 100 | 1.8 s | 0.8 s |
| `/` | Sau | 100 | 100 | 100 | 1.5 s | 0.8 s |
| `/products` | Sau | 100 | 100 | 100 | 1.8 s | 0.8 s |

