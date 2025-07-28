import {
  Box,
  Button,
  Fab,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useSharedFoodListContext } from "../context/SharedFoodListContext";
import { useFoodDraftContext } from "../context/FoodDraftContext";
import { useFriend } from "./FoodFlowWrapper";
import { FoodEntry } from "../data/mockData";
import { updateSharedFoodList } from "../api/api";
import { FoodCard } from "../components/FoodCard";
import { AppDialog } from "../components/AppDialog";
import { usePageHeader } from "../hooks/usePageHeader";

export function SharedFoodList() {
  const { friend } = useFriend();
  usePageHeader(`Shared food list with ${friend.username}`, true);

  const { id } = useUserContext();
  const navigate = useNavigate();
  const sharedFoodListContext = useSharedFoodListContext();
  const sharedFoodEntries = sharedFoodListContext?.sharedFoodEntries ?? [];
  const sortedSharedFoodEntries =
    sharedFoodListContext?.sortedSharedFoodEntries ?? [];
  const { setDraft } = useFoodDraftContext();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDelete = async (foodEntry: FoodEntry) => {
    if (!sharedFoodListContext) {
      console.log("No SharedFoodListContext provider");
      return;
    }
    const { setSharedFoodEntries } = sharedFoodListContext;
    const updatedSharedList: FoodEntry[] = sharedFoodEntries.filter(
      (entry: FoodEntry) => entry.id !== foodEntry.id
    );

    setSharedFoodEntries(updatedSharedList);
    await updateSharedFoodList(
      id,
      friend.id,
      updatedSharedList.map((entry) => entry.id)
    );
  };

  const handleEdit = async (foodEntry: FoodEntry) => {
    setDraft(foodEntry);
    navigate(`/friend/${friend.id}/shared-food-list/edit-food/${foodEntry.id}`);
  };

  const AddFoodFab = (
    <Fab
      onClick={() => setDialogOpen(true)}
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

  const CustomAppDialog = (
    <AppDialog
      open={dialogOpen}
      withTextField={false}
      titleText="Add food"
      contentText="What would you like to do?"
      onClose={() => setDialogOpen(false)}
      customActions={
        isMobile ? (
          <Stack sx={{ width: "100%", gap: 1 }}>
            <Button
              startIcon={<Add />}
              variant="contained"
              fullWidth
              type="button"
              onClick={() => {
                setDialogOpen(false);
                navigate(
                  `/friend/${friend.id}/shared-food-list/add-existing-food`
                );
              }}
            >
              Add from existing food
            </Button>
            <Button
              startIcon={<Edit />}
              variant="outlined"
              fullWidth
              type="button"
              onClick={() => {
                setDialogOpen(false);
                navigate(`/friend/${friend.id}/shared-food-list/create-food`);
              }}
            >
              Create new food
            </Button>
          </Stack>
        ) : (
          <Stack sx={{ flexDirection: "row", width: "100%", gap: 1 }}>
            <Button
              startIcon={<Add />}
              variant="contained"
              type="button"
              onClick={() => {
                setDialogOpen(false);
                navigate(
                  `/friend/${friend.id}/shared-food-list/add-existing-food`
                );
              }}
            >
              Add from existing food
            </Button>
            <Button
              startIcon={<Edit />}
              variant="outlined"
              type="button"
              onClick={() => {
                setDialogOpen(false);
                navigate(`/friend/${friend.id}/shared-food-list/create-food`);
              }}
            >
              Create new food
            </Button>
          </Stack>
        )
      }
    />
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
        {CustomAppDialog}
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={5} sx={{ alignItems: "center", pb: { xs: 10, sm: 12 } }}>
        {sortedSharedFoodEntries.map((foodEntry: FoodEntry) => (
          <FoodCard
            key={foodEntry.id}
            foodEntry={foodEntry}
            variant="base"
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </Stack>
      {AddFoodFab}
      {CustomAppDialog}
    </Box>
  );
}
