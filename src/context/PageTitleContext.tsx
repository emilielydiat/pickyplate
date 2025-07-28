import { createContext, useContext, useState, ReactNode } from "react";

type PageTitleContextType = {
  pageTitle: string | null;
  showBackBtn: boolean;
  setPageTitle: (pageTitle: string | null) => void;
  setShowBackBtn: (showBackBtn: boolean) => void;
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
  const [showBackBtn, setShowBackBtn] = useState<boolean>(false);

  return (
    <PageTitleContext.Provider
      value={{ pageTitle, showBackBtn, setPageTitle, setShowBackBtn }}
    >
      {children}
    </PageTitleContext.Provider>
  );
}
