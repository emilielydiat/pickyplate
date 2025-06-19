import { Typography } from "@mui/material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";

export function SubmitRating() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Submit rating");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  return <Typography>Submit rating page (coming soon)</Typography>;
}
