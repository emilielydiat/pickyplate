import { Box, Fab, Stack } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { emptyStateImages } from "../data/mockData";
import { FoodCard } from "../components/FoodCard";
import { AppDialog } from "../components/AppDialog";
import { EmptyState } from "../components/EmptyState";
import { FoodEntry, User } from "../types";
import {
  getSharedFoodList,
  getUserById,
  removeFoodEntryFromSharedList,
} from "../api/api";
import { useUserContext } from "../context/UserContext";
import { usePageTitleContext } from "../context/PageTitleContext";

export function SharedFoodList() {
  const { setPageTitle } = usePageTitleContext();

  const { id } = useUserContext();
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [sharedFoodEntries, setSharedFoodEntries] = useState<FoodEntry[]>([]);
  const [friend, setFriend] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const fetchSharedFoodEntries = async () => {
    const foodEntries = await getSharedFoodList(friendId!);
    setSharedFoodEntries(foodEntries);
  };

  const handleEdit = async (foodId: string) => {
    navigate(`/my-food-list/edit-food/${foodId}?share=${friendId}`);
  };

  const handleRemove = async (foodId: string) => {
    await removeFoodEntryFromSharedList(id, friendId!, foodId);
    await fetchSharedFoodEntries();
  };

  useEffect(() => {
    (async () => {
      const friend = await getUserById(friendId!);
      setFriend(friend);
      await fetchSharedFoodEntries();
    })();
  }, [friendId]);

  useEffect(() => {
    if (friend) setPageTitle(`Shared food list with ${friend?.name ?? ""}`);
  }, [friend]);

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
      primaryBtnIcon={<Add />}
      primaryBtnLabel="Add from existing food"
      secondaryBtnIcon={<Edit />}
      secondaryBtnLabel="Create new food"
      onClose={() => setDialogOpen(false)}
      onPrimaryAction={() => {
        setDialogOpen(false);
        navigate(`/friend/${friendId}/shared-food-list/add-existing-food`);
      }}
      onSecondaryAction={() => {
        setDialogOpen(false);
        navigate(`/my-food-list/create-food?share=${friendId}`);
      }}
    />
  );

  // TO DO: loading

  if (sharedFoodEntries.length === 0) {
    return (
      <Box component="section">
        <EmptyState
          image={emptyStateImages.sharedFoodList}
          heading="Start building your shared food list"
          textContent={`Add some food you'd love to share with ${friend?.name}, it'll make choosing together a breeze!`}
        />
        {AddFoodFab}
        {CustomAppDialog}
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={5} sx={{ alignItems: "center", pb: { xs: 10, sm: 12 } }}>
        {sharedFoodEntries.map((foodEntry: FoodEntry) => (
          <FoodCard
            key={foodEntry.id}
            foodEntry={foodEntry}
            variant={foodEntry.user_id === id ? "base" : "short"}
            onEdit={() => handleEdit(foodEntry.id!)}
            onDelete={() => handleRemove(foodEntry.id!)}
          />
        ))}
      </Stack>
      {AddFoodFab}
      {CustomAppDialog}
    </Box>
  );
}
