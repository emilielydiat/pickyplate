import { Fab, Box, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useUserContext } from "../context/UserContext";
import { useUserFoodListContext } from "../context/UserFoodListContext";
import { useSharedFoodListContext } from "../context/SharedFoodListContext";
import { useFriend } from "./FoodFlowWrapper";
import { FoodEntry } from "../data/mockData";
import { updateSharedFoodList } from "../api/api";
import { FoodCard } from "../components/FoodCard";

export function AddFromExistingFood() {
  const { setPageTitle } = usePageTitleContext();
  const { id } = useUserContext();
  const { friend } = useFriend();
  const { userFoodEntries, sortedUserFoodEntries } = useUserFoodListContext();
  const sharedFoodListContext = useSharedFoodListContext();
  const sharedFoodEntries = sharedFoodListContext?.sharedFoodEntries ?? [];

  useEffect(() => {
    setPageTitle("Add from existing food");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const handleToggleAdd = async (foodEntry: FoodEntry): Promise<void> => {
    if (!sharedFoodListContext) {
      console.log("No SharedFoodListContext provider");
      return;
    }

    const { setSharedFoodEntries } = sharedFoodListContext;
    const isAdded = sharedFoodEntries.some(
      (entry: FoodEntry) => entry.id === foodEntry.id
    );

    let updatedSharedList: FoodEntry[] = [];

    if (isAdded) {
      updatedSharedList = sharedFoodEntries.filter(
        (entry: FoodEntry) => entry.id !== foodEntry.id
      );
    } else {
      updatedSharedList = [...sharedFoodEntries, foodEntry];
    }

    setSharedFoodEntries(updatedSharedList);
    await updateSharedFoodList(
      id,
      friend.id,
      updatedSharedList.map((entry: FoodEntry) => entry.id)
    );
  };

  const AddFoodFab = (
    <Fab
      component={Link}
      to={`/friend/${friend.id}/shared-food-list/create-food`}
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

  if (userFoodEntries.length === 0 && sharedFoodEntries.length === 0) {
    return (
      <Box component="section">
        <Typography component="h2" variant="body1">
          Loading...
        </Typography>
        {AddFoodFab}
      </Box>
    );
  }

  if (userFoodEntries.length === 0) {
    return (
      <Box component="section">
        <Typography component="h2" variant="body1">
          No food entries available to add.
        </Typography>
        {AddFoodFab}
      </Box>
    );
  }

  return (
    <Box component="section">
      <Stack spacing={5} sx={{ alignItems: "center", pb: { xs: 10, sm: 12 } }}>
        {sortedUserFoodEntries.map((foodEntry) => (
          <FoodCard
            key={foodEntry.id}
            foodEntry={foodEntry}
            variant="toAdd"
            isAlreadyAdded={sharedFoodEntries.some(
              (entry: FoodEntry) => entry.id === foodEntry.id
            )}
            onToggleAdd={handleToggleAdd}
          />
        ))}
      </Stack>
      {AddFoodFab}
    </Box>
  );
}
