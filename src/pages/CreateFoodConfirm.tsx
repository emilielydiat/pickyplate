import { Typography } from "@mui/material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";

export function CreateFoodConfirm() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Review and save");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  return <Typography>Create food confirm page (coming soon)</Typography>;
}
