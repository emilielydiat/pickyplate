import { Box, Fab, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useUserFoodListContext } from "../context/UserFoodListContext";
import { FoodCard } from "./FoodCard";

export function MyFoodList() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("My food list");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const { userFoodEntries, sortedUserFoodEntries } = useUserFoodListContext();

  const AddFoodFab = (
    <Fab
      component={Link}
      to="/my-food-list/create-food"
      aria-label="Create new food"
      variant="extended"
      size="medium"
      color="primary"
      sx={{
        position: "fixed",
        bottom: { xs: 16, md: 24 },
        right: { xs: 16, md: "calc(50% - 450px + 24px)" },
        zIndex: 1050,
        cursor: "pointer",
      }}
    >
      <Add sx={{ mr: 1 }} />
      Create new food
    </Fab>
  );

  // TO DO: loading

  if (userFoodEntries.length === 0) {
    return (
      <Box component="section">
        <Typography component="h2" variant="body1">
          You haven't added any food entries yet. <br /> Click the button below
          to add one!
        </Typography>
        {AddFoodFab}
      </Box>
    );
  }

  return (
    <Box component="section">
      <Stack spacing={5} sx={{ alignItems: "center", pb: { xs: 10, sm: 12 } }}>
        {sortedUserFoodEntries.map((foodEntry) => (
          <FoodCard key={foodEntry.id} foodEntry={foodEntry} variant="base" />
        ))}
      </Stack>
      {AddFoodFab}
    </Box>
  );
}
