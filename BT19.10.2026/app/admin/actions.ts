"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { can } from "@/lib/permissions";
import { deleteProductById } from "@/lib/products";

const DeleteProductSchema = z.object({
  id: z.string().min(1, "Thiếu id sản phẩm"),
});

export async function deleteProductAction(formData: FormData) {
  // Lớp bảo vệ #3: Server Action là endpoint công khai — ai biết action
  // reference cũng gọi được, không chỉ qua nút trên giao diện. Luôn kiểm tra
  // lại phiên và quyền NGAY TRONG action, không tin bất kỳ gì từ client.
  const session = await auth();
  if (!session?.user || !can(session.user.role, "product:write")) {
    throw new Error("Không có quyền thực hiện hành động này.");
  }

  // Không tin dữ liệu từ form — validate bằng zod trước khi chạm tầng dữ liệu.
  const { id } = DeleteProductSchema.parse({ id: formData.get("id") });

  const deleted = await deleteProductById(id);
  if (!deleted) {
    throw new Error("Không tìm thấy sản phẩm.");
  }

  revalidatePath("/admin");
  revalidatePath("/products");
}
