import type { Role } from "./role";

export type MockUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
};

// Dữ liệu mock cục bộ (chưa có backend thật). Mật khẩu đã băm sẵn bằng bcrypt,
// không hard-code chuỗi gốc. Đăng nhập thử: admin@shop.vn / Admin@123, user@shop.vn / User@123
export const mockUsers: MockUser[] = [
  {
    id: "u1",
    email: "admin@shop.vn",
    name: "Quản trị viên",
    role: "admin",
    passwordHash:
      "$2b$10$27RZH1a8FfVgoDVvGWHc1ePZi9CM5Mq1oWK94C5x4oyvqikgPD4iW",
  },
  {
    id: "u2",
    email: "user@shop.vn",
    name: "Khách hàng",
    role: "user",
    passwordHash:
      "$2b$10$NKitD8ISEzJIuFyt6/NmQuyhcGIya3na95RJt4hgj4U1xfqhlp4b2",
  },
];

export function findUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
