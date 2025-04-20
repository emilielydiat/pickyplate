import { Typography } from "@mui/material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";

export function PickFriend() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Pick a friend");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  return <Typography>Pick a friend page (coming soon)</Typography>;
}
