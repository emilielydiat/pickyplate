import { Box, Button, Stack } from "@mui/material";
import { Checklist } from "@mui/icons-material";
import { usePageHeader } from "../hooks/usePageHeader";
import { Link } from "react-router-dom";

export function Settings() {
  usePageHeader("Settings", false);

  return (
    <Box>
      <Stack>
        <Button
          component={Link}
          to="/settings/set-meal-priorities"
          aria-label="Set meal priorities"
          startIcon={<Checklist />}
          variant="outlined"
        >
          Set meal priorities
        </Button>
      </Stack>
    </Box>
  );
}
