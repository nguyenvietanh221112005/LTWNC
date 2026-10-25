import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { can } from "@/lib/permissions";
import { getProducts, formatPriceVND } from "@/lib/products";
import { mockUsers } from "@/lib/users";
import { deleteProductAction } from "./actions";

export const metadata: Metadata = {
  title: "Quản trị",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // Lớp bảo vệ #2: Middleware đã chặn /admin cho user không đủ quyền, nhưng
  // page vẫn tự kiểm tra lại trước khi lấy dữ liệu (layout không re-render
  // khi điều hướng giữa trang con, nên không thể chỉ kiểm tra ở layout).
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!can(session.user.role, "user:manage")) redirect("/403");

  const products = await getProducts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Quản trị</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Chỉ vai trò <code>admin</code> mới xem được trang này.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Người dùng</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-zinc-500">
            <tr>
              <th className="py-1">Email</th>
              <th className="py-1">Tên</th>
              <th className="py-1">Vai trò</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((u) => (
              <tr key={u.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.name}</td>
                <td className="py-2">
                  <code>{u.role}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Sản phẩm</h2>
        <ul className="mt-3 space-y-2">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-800"
            >
              <span>
                {p.name} — {formatPriceVND(p.price)}
              </span>
              <form action={deleteProductAction}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:underline"
                >
                  Xoá
                </button>
              </form>
            </li>
          ))}
          {products.length === 0 && (
            <li className="text-sm text-zinc-500">Không còn sản phẩm nào.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
