import {
  Box,
  Button,
  Chip,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";
import { User } from "../data/mockData";

interface MealPreferencesProps {
  friend: User;
}

export function MealPreferences({ friend }: MealPreferencesProps) {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle(`Meal preferences with ${friend.username}`);
    return () => setPageTitle(null);
  }, [friend, setPageTitle]);

  return (
    <Box>
      <Typography>Meal preferences page (coming soon)</Typography>
    </Box>
  );
}
