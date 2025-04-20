import { createContext, useContext, useState, ReactNode } from "react";

type PageTitleContextType = {
  pageTitle: string | null;
  setPageTitle: (pageTitle: string | null) => void;
};

const PageTitleContext = createContext<PageTitleContextType | null>(null);

export function usePageTitleContext() {
  const context = useContext(PageTitleContext);

  if (!context) {
    throw new Error("usePageTitle must be used within a PageTitleProvider");
  }
  return context;
}

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitle] = useState<string | null>(null);

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}
