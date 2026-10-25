import { ImageResponse } from "next/og";
import { getProduct, formatPriceVND } from "@/lib/products";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ id: string }> };

export default async function Image({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  const name = product?.name ?? "Sản phẩm";
  const price = product ? formatPriceVND(product.price) : "";
  const color = product?.color ?? "#2563eb";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          backgroundColor: color,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.85 }}>My Shop</div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 24 }}>
          {name}
        </div>
        <div style={{ fontSize: 40, marginTop: 16 }}>{price}</div>
      </div>
    ),
    size,
  );
}
