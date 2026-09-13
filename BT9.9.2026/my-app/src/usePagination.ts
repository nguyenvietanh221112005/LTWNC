import { useState, useMemo } from "react";

// Kiểu dữ liệu trả về của hook
interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  next: () => void;
  prev: () => void;
  goToPage: (page: number) => void;
}

// Nhận vào mảng dữ liệu T[] và số item/trang -> trả về thông tin + hàm điều hướng phân trang
function usePagination<T>(data: T[], itemsPerPage: number): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  // Dữ liệu của trang hiện tại
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(safePage);
  };

  const next = () => goToPage(currentPage + 1);
  const prev = () => goToPage(currentPage - 1);

  return { currentPage, totalPages, currentData, next, prev, goToPage };
}

export default usePagination;

// ----- Ví dụ áp dụng cho danh sách sản phẩm -----
// interface Product {
//   id: number;
//   name: string;
// }
//
// function ProductList({ products }: { products: Product[] }) {
//   const { currentData, currentPage, totalPages, next, prev, goToPage } =
//     usePagination<Product>(products, 10);
//
//   return (
//     <div>
//       <ul>
//         {currentData.map((p) => (
//           <li key={p.id}>{p.name}</li>
//         ))}
//       </ul>
//       <button onClick={prev} disabled={currentPage === 1}>Trước</button>
//       <span>Trang {currentPage}/{totalPages}</span>
//       <button onClick={next} disabled={currentPage === totalPages}>Sau</button>
//     </div>
//   );
// }
