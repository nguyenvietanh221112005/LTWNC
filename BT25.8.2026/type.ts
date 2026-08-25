// Quản lý đơn hàng 

// Enum
export enum OrderStatus {
  Pending = "PENDING",
  Confirmed = "CONFIRMED",
  Shipping = "SHIPPING",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED",
}

export enum PaymentMethod {
  COD = "COD",
  BankTransfer = "BANK_TRANSFER",
  CreditCard = "CREDIT_CARD",
}

// interfaces
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface OrderItem extends Pick<Product, "id" | "name"> {
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  createdAt: Date;
}

// Generic
export type CreateInput<T> = Omit<T, "id" | "createdAt">;
export type UpdateInput<T> = Partial<Omit<T, "id" | "createdAt">>;

// utility
export type CreateOrderInput = CreateInput<Order>;
export type UpdateOrderInput = UpdateInput<Order>;

export type OrderSummary = Pick<Order, "id" | "status" | "totalAmount">;

// Lý do :
// Enum (OrderStatus, PaymentMethod): dùng cho tập giá trị cố định, hữu hạn — tránh gõ sai chuỗi trạng thái.
// 4 interface tách riêng (Order, OrderItem, Product, Customer): mỗi entity định nghĩa một nghiệp vụ độc lập, dễ tái sử dụng ở module khác.
// OrderItem extends Pick<Product, "id" | "name">: không khai báo lại id, name trong OrderItem, dùng Pick để lấy lại từ Product — nếu Product đổi cấu trúc, OrderItem tự động đồng bộ, tránh trùng lặp code.
// Generic CreateInput<T> và UpdateInput<T>: không viết riêng cho từng entity, dùng generic một lần rồi áp dụng cho các interface khác — tiết kiệm code và đảm bảo logic nhất quán.
// Omit: loại bỏ các field do hệ thống tự sinh khỏi input khi tạo mới, tránh client tự truyền sai giá trị.
// Partial: cho phép khi update tùy chọn field cần thay đổi.
// Utility: tái sử dụng generic cho order
// Pick: chỉ lấy một số field cần hiển thị, tránh trả về/xử lý dư thừa dữ liệu không cần thiết.