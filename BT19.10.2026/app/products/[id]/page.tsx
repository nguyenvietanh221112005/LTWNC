import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts, formatPriceVND } from "@/lib/products";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

// SSG: sinh sẵn trang cho từng sản phẩm lúc build
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

// SEO động theo từng sản phẩm — canonical + openGraph; ảnh chia sẻ lấy từ
// opengraph-image.tsx cùng thư mục (Next.js tự gắn thẻ og:image)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    alternates: {
      canonical: `/products/${product.id}`,
    },
    openGraph: {
      title: product.name,
      description: product.summary,
      url: `/products/${product.id}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${SITE_URL}/products/${product.id}/opengraph-image`,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div
        className="mb-6 h-48 w-full rounded-xl"
        style={{ backgroundColor: product.color }}
        aria-hidden
      />
      <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        {product.description}
      </p>
      <p className="mt-4 text-xl font-semibold">
        {formatPriceVND(product.price)}
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        {product.inStock ? "Còn hàng" : "Hết hàng"}
      </p>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
