export type Product = {
  id: string;
  name: string;
  price: number;
  summary: string;
  description: string;
  color: string; // dùng để vẽ ảnh placeholder (list, opengraph-image) — không cần file ảnh thật
  inStock: boolean;
  updatedAt: string; // ISO date, dùng cho sitemap.lastModified
};

// Dữ liệu mock cục bộ (chưa có backend thật) — đủ để dựng SSG/ISR, metadata động,
// opengraph-image và JSON-LD cho trang chi tiết sản phẩm.
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Giày chạy bộ Pro",
    price: 1_200_000,
    summary: "Giày chạy bộ nhẹ, đệm êm, phù hợp luyện tập hằng ngày.",
    description:
      "Giày chạy bộ Pro dùng đế đệm êm, thân giày lưới thoáng khí, trọng lượng chỉ 230g mỗi chiếc — lựa chọn tốt cho người mới tập chạy.",
    color: "#2563eb",
    inStock: true,
    updatedAt: "2026-10-01",
  },
  {
    id: "2",
    name: "Áo thể thao Dry-Fit",
    price: 350_000,
    summary: "Áo thun thể thao thấm hút mồ hôi, co giãn 4 chiều.",
    description:
      "Áo Dry-Fit dùng vải polyester pha spandex, thấm hút mồ hôi nhanh, co giãn 4 chiều, phù hợp chạy bộ và tập gym.",
    color: "#16a34a",
    inStock: true,
    updatedAt: "2026-09-20",
  },
  {
    id: "3",
    name: "Balo du lịch 30L",
    price: 890_000,
    summary: "Balo chống nước, nhiều ngăn, phù hợp đi học và du lịch ngắn.",
    description:
      "Balo du lịch 30L vải chống nước, có ngăn đệm cho laptop 15 inch, nhiều ngăn phụ chia đồ gọn gàng.",
    color: "#ea580c",
    inStock: true,
    updatedAt: "2026-08-15",
  },
  {
    id: "4",
    name: "Bình giữ nhiệt 500ml",
    price: 220_000,
    summary: "Giữ nhiệt 12 giờ, vỏ inox 304, chống trầy xước.",
    description:
      "Bình giữ nhiệt 500ml vỏ inox 304 2 lớp, giữ nóng/lạnh tới 12 giờ, nắp vặn chống rò rỉ.",
    color: "#7c3aed",
    inStock: false,
    updatedAt: "2026-10-10",
  },
  {
    id: "5",
    name: "Tai nghe thể thao Bluetooth",
    price: 650_000,
    summary: "Chống nước IPX7, pin 20 giờ, âm bass mạnh.",
    description:
      "Tai nghe thể thao Bluetooth 5.3, chuẩn chống nước IPX7, pin nghe liên tục 20 giờ, phù hợp chạy bộ và tập gym.",
    color: "#db2777",
    inStock: true,
    updatedAt: "2026-10-18",
  },
];

export async function getProducts(): Promise<Product[]> {
  return mockProducts;
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return mockProducts.find((p) => p.id === id);
}

// Tầng dữ liệu (mock): mọi lớp gọi vào đây đều đã được kiểm tra quyền ở phía
// gọi (Server Action) — hàm này không tự kiểm tra lại role, chỉ mô phỏng DB.
export async function deleteProductById(id: string): Promise<boolean> {
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  mockProducts.splice(index, 1);
  return true;
}

export function formatPriceVND(price: number): string {
  return price.toLocaleString("vi-VN") + "đ";
}
