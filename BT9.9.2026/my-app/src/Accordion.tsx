import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

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

interface AccordionProps {
  defaultActiveId?: string | null;
  children: ReactNode;
}
function Accordion({ defaultActiveId = null, children }: AccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId);

  const toggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ activeId, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

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

