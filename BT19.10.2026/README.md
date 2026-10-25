# BT Tuần 8 — NextAuth, Middleware RBAC, SEO nâng cao (Next.js)

Bài tập tuần 8 (LTWNC — Lập trình Web nâng cao): tích hợp NextAuth (Auth.js
v5) vào dự án Next.js App Router, phân quyền 2 vai trò (`admin`, `user`)
bằng Middleware + kiểm tra ở page/Server Action, và SEO nâng cao (canonical,
opengraph-image, JSON-LD) cho các trang công khai.

Xem báo cáo chi tiết tại [`BAO_CAO_NEXTAUTH_SEO.md`](./BAO_CAO_NEXTAUTH_SEO.md).

## Chạy thử

```bash
npm install
cp .env.local.example .env.local   # rồi sinh AUTH_SECRET: npx auth secret
npm run dev
```

Mở http://localhost:8000.

> Lưu ý: dự án chạy ở cổng 8000 — trùng cổng với backend CoBuy-Global
> (`PORT=8000`). Không chạy cả hai cùng lúc trên cùng máy.

- Đăng nhập Credentials bằng tài khoản mẫu (mock, không có backend thật):
  - Admin: `admin@shop.vn` / `Admin@123`
  - User: `user@shop.vn` / `User@123`
- Đăng nhập Google (OAuth): cần tạo OAuth Client (loại "Web application")
  tại https://console.cloud.google.com/apis/credentials, thêm Authorized
  redirect URI `http://localhost:8000/api/auth/callback/google`, rồi điền
  `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` vào `.env.local`.

## Trang chính

| Route | Loại | Ghi chú |
| --- | --- | --- |
| `/` | Công khai (SSG) | canonical, openGraph, JSON-LD `Organization` |
| `/products` | Công khai (ISR, 60s) | canonical, openGraph |
| `/products/[id]` | Công khai (SSG) | `generateMetadata` động, `opengraph-image.tsx`, JSON-LD `Product` |
| `/login` | Công khai | Credentials + Google OAuth (Server Action) |
| `/dashboard` | Riêng tư (mọi user đã đăng nhập) | `noindex`; chặn bởi Middleware + `auth()` |
| `/admin` | Riêng tư (chỉ `admin`) | chặn bởi Middleware + `auth()` + Server Action re-check quyền |

## Kiểm tra nhanh

```bash
npm run build && npm run start   # đo Lighthouse trên bản production, không đo trên npm run dev
```

- View-source `/` và `/products/1` để thấy `<title>`, `<meta>`,
  `<link rel="canonical">`, `<script type="application/ld+json">` render sẵn.
- Mở `/products/1/opengraph-image` để xem ảnh chia sẻ sinh động.
- Vào `/admin` bằng tài khoản `user` → bị chuyển tới `/403`.
