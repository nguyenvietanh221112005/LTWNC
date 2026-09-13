import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// 1) Context lưu id panel đang mở (chỉ 1 panel active tại 1 thời điểm)
interface AccordionContextType {
  activeId: string | null;
  toggle: (id: string) => void;
}
const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion.* phải được đặt bên trong <Accordion>");
  return ctx;
}

// 2) Component cha: cung cấp Context, quản lý state "activeId"
interface AccordionProps {
  defaultActiveId?: string | null;
  children: ReactNode;
}
function Accordion({ defaultActiveId = null, children }: AccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId);

  // Mở panel này thì tự động đóng panel khác:
  // nếu click lại panel đang mở -> đóng luôn (activeId = null)
  const toggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ activeId, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

// 3) Item: bọc 1 cặp Header + Panel, truyền "id" xuống qua Context riêng của Item
interface AccordionItemContextType {
  id: string;
}
const AccordionItemContext = createContext<AccordionItemContextType | null>(null);

function useAccordionItemContext() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error("Accordion.Header/Panel phải nằm trong Accordion.Item");
  return ctx;
}

interface AccordionItemProps {
  id: string;
  children: ReactNode;
}
function Item({ id, children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ id }}>
      <div className="accordion-item">{children}</div>
    </AccordionItemContext.Provider>
  );
}

// 4) Header: click để mở/đóng panel tương ứng
interface AccordionHeaderProps {
  children: ReactNode;
}
function Header({ children }: AccordionHeaderProps) {
  const { id } = useAccordionItemContext();
  const { activeId, toggle } = useAccordionContext();
  const isActive = activeId === id;

  return (
    <button
      className={isActive ? "accordion-header active" : "accordion-header"}
      onClick={() => toggle(id)}
    >
      {children}
    </button>
  );
}

// 5) Panel: chỉ hiển thị nội dung khi id trùng với activeId
interface AccordionPanelProps {
  children: ReactNode;
}
function Panel({ children }: AccordionPanelProps) {
  const { id } = useAccordionItemContext();
  const { activeId } = useAccordionContext();

  if (activeId !== id) return null;
  return <div className="accordion-panel">{children}</div>;
}

Accordion.Item = Item;
Accordion.Header = Header;
Accordion.Panel = Panel;

export default Accordion;

// ----- Ví dụ sử dụng -----
// <Accordion defaultActiveId="faq1">
//   <Accordion.Item id="faq1">
//     <Accordion.Header>Câu hỏi 1</Accordion.Header>
//     <Accordion.Panel>Nội dung trả lời 1</Accordion.Panel>
//   </Accordion.Item>
//   <Accordion.Item id="faq2">
//     <Accordion.Header>Câu hỏi 2</Accordion.Header>
//     <Accordion.Panel>Nội dung trả lời 2</Accordion.Panel>
//   </Accordion.Item>
// </Accordion>
