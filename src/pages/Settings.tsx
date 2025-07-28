import { Typography } from "@mui/material";
import { usePageHeader } from "../hooks/usePageHeader";

export function Settings() {
  usePageHeader("Settings", false);

  return <Typography>Settings page (coming soon)</Typography>;
}
