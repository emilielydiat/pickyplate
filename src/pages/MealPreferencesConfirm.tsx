import { Typography } from "@mui/material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";

export function MealPreferencesConfirm() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Confirm and send");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  return <Typography>Confirm and send page (coming soon)</Typography>;
}
