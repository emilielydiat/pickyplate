import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";

export function usePageHeader(pageTitle: string, showBackBtn: boolean = false) {
  const { setPageTitle, setShowBackBtn } = usePageTitleContext();

  useEffect(() => {
    setPageTitle(pageTitle);
    setShowBackBtn(showBackBtn);

    return () => {
      setPageTitle(null);
      setShowBackBtn(false);
    };
  }, [pageTitle, showBackBtn, setPageTitle, setShowBackBtn]);
}
