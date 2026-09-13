import Accordion from "./Accordion";
import usePagination from "./usePagination";

interface Product {
  id: number;
  name: string;
}

const products: Product[] = Array.from({ length: 23 }, (_, index) => ({
  id: index + 1,
  name: `Sản phẩm ${index + 1}`,
}));

function ProductList() {
  const { currentData, currentPage, totalPages, next, prev, goToPage } =
    usePagination<Product>(products, 5);

  return (
    <section>
      <h2>Danh sách sản phẩm</h2>
      <ul>
        {currentData.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>

      <button type="button" onClick={prev} disabled={currentPage === 1}>
        Trước
      </button>
      <span style={{ margin: "0 8px" }}>
        Trang {currentPage}/{totalPages}
      </span>
      <button
        type="button"
        onClick={next}
        disabled={currentPage === totalPages}
      >
        Sau
      </button>

      <div style={{ marginTop: 8 }}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              type="button"
              key={page}
              onClick={() => goToPage(page)}
              style={{ fontWeight: page === currentPage ? "bold" : "normal" }}
            >
              {page}
            </button>
          ),
        )}
      </div>
    </section>
  );
}

function FaqAccordion() {
  return (
    <section>
      <h2>FAQ</h2>
      <Accordion defaultActiveId="faq1">
        <Accordion.Item id="faq1">
          <Accordion.Header>React là gì?</Accordion.Header>
          <Accordion.Panel>
            React là thư viện JavaScript dùng để xây dựng giao diện người dùng.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="faq2">
          <Accordion.Header>Compound Component là gì?</Accordion.Header>
          <Accordion.Panel>
            Là mẫu thiết kế gồm nhiều component nhỏ phối hợp qua Context API.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="faq3">
          <Accordion.Header>Vì sao dùng Context API?</Accordion.Header>
          <Accordion.Panel>
            Để các component con dùng chung state mà không cần truyền props qua
            nhiều tầng.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </section>
  );
}

function App() {
  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <FaqAccordion />
      <hr style={{ margin: "24px 0" }} />
      <ProductList />
    </main>
  );
}

export default App;
