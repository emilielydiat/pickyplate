import { Box, Fab, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useUserContext } from "../context/UserContext";
import { useSharedFoodListContext } from "../context/SharedFoodListContext";
import { FoodEntry, User } from "../data/mockData";
import { updateSharedFoodList } from "../api/api";
import { FoodCard } from "./FoodCard";

interface SharedFoodListProps {
  friend: User;
}

export function SharedFoodList({ friend }: SharedFoodListProps) {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle(`Shared food list with ${friend.username}`);
    return () => setPageTitle(null);
  }, [friend, setPageTitle]);

  const { id } = useUserContext();
  const { sharedFoodEntries, setSharedFoodEntries, sortedSharedFoodEntries } =
    useSharedFoodListContext();

  const handleDelete = async (foodEntry: FoodEntry) => {
    const updatedSharedList: FoodEntry[] = sharedFoodEntries.filter(
      (entry) => entry.id !== foodEntry.id
    );

    setSharedFoodEntries(updatedSharedList);
    await updateSharedFoodList(
      id,
      friend.id,
      updatedSharedList.map((entry) => entry.id)
    );
  };

  const AddFoodFab = (
    <Fab
      component={Link}
      to={`/friend/${friend.id}/shared-food-list/add-existing-food`}
      aria-label="Add food"
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
      Add food
    </Fab>
  );

  // TO DO: loading

  if (sharedFoodEntries.length === 0) {
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
    <Box>
      <Stack spacing={5} sx={{ alignItems: "center", pb: { xs: 10, sm: 12 } }}>
        {sortedSharedFoodEntries.map((foodEntry) => (
          <FoodCard
            key={foodEntry.id}
            foodEntry={foodEntry}
            onDelete={handleDelete}
          />
        ))}
      </Stack>
      {AddFoodFab}
    </Box>
  );
}
