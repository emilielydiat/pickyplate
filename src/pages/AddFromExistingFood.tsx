import { Box, Stack, Typography } from "@mui/material";
import { useUserContext } from "../context/UserContext";
import { useUserFoodListContext } from "../context/UserFoodListContext";
import { useSharedFoodListContext } from "../context/SharedFoodListContext";
import { useFriend } from "./FoodFlowWrapper";
import { FoodEntry } from "../data/mockData";
import { updateSharedFoodList } from "../api/api";
import { FoodCard } from "../components/FoodCard";
import { usePageHeader } from "../hooks/usePageHeader";

export function AddFromExistingFood() {
  usePageHeader("Add from existing food", true);

  const { id } = useUserContext();
  const { friend } = useFriend();
  const { userFoodEntries, sortedUserFoodEntries } = useUserFoodListContext();
  const sharedFoodListContext = useSharedFoodListContext();
  const sharedFoodEntries = sharedFoodListContext?.sharedFoodEntries ?? [];

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

  if (userFoodEntries.length === 0 && sharedFoodEntries.length === 0) {
    return (
      <Box component="section">
        <Typography component="h2" variant="body1">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (userFoodEntries.length === 0) {
    return (
      <Box component="section">
        <Typography component="h2" variant="body1">
          No food entries available to add.
        </Typography>
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
    </Box>
  );
}
