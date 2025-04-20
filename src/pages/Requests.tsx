import { Typography } from "@mui/material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";

export function Requests() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Requests");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  return <Typography>Requests page (coming soon)</Typography>;
}
