import { Typography } from "@mui/material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";

export function Settings() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Settings");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  return <Typography>Settings page (coming soon)</Typography>;
}
