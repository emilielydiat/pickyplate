import { Typography } from "@mui/material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";

export function ViewResults() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("View results");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  return <Typography>View results page (coming soon)</Typography>;
}
