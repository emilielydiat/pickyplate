import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";

export function AddFriend() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Add friend");
  }, [setPageTitle]);

  return (
    <Box>
      <Typography>Add friend page (coming soon)</Typography>
    </Box>
  );
}
