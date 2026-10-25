import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, formatPriceVND } from "@/lib/products";

// Trang công khai #2 — SEO: canonical; ISR (danh mục sản phẩm đổi định kỳ)
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Danh sách sản phẩm thể thao: giày, áo, balo, phụ kiện.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Sản phẩm | My Shop",
    description: "Danh sách sản phẩm thể thao chính hãng.",
    url: "/products",
  },
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Sản phẩm</h1>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <Link href={`/products/${p.id}`} className="block">
              <div
                className="mb-3 h-24 w-full rounded-lg"
                style={{ backgroundColor: p.color }}
                aria-hidden
              />
              <h2 className="font-medium">{p.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">{p.summary}</p>
              <p className="mt-2 font-semibold">{formatPriceVND(p.price)}</p>
              {!p.inStock && (
                <p className="mt-1 text-xs text-red-600">Hết hàng</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
