import { Box, Fab, Stack } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
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
import { usePageHeader } from "../hooks/usePageHeader";
import { useDialogManager } from "../hooks/useDialogManager";

export function SharedFoodList() {
  const { id } = useUserContext();
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [sharedFoodEntries, setSharedFoodEntries] = useState<FoodEntry[]>([]);
  const [friend, setFriend] = useState<User | null>(null);

  usePageHeader(`Shared food list with ${friend?.name ?? ""}`, true);

  const { dialogOpen, dialogConfig, openDialog, closeDialog } =
    useDialogManager();

  const fetchSharedFoodEntries = useCallback(async () => {
    const foodEntries = await getSharedFoodList(friendId!);
    setSharedFoodEntries(foodEntries);
  }, [friendId]);

  const handleEdit = async (foodId: string) => {
    closeDialog();
    navigate(`/my-food-list/edit-food/${foodId}?share=${friendId}`);
  };

  const handleDelete = async (foodId: string) => {
    openDialog({
      titleText: "Delete food from shared food list?",
      contentText:
        "Once removed, this item will no longer appear in the shared food list with this user",
      primaryBtnLabel: "Delete",
      secondaryBtnLabel: "Cancel",
      onSecondaryAction: closeDialog,
      onPrimaryAction: () => handleRemove(foodId!),
    });
  };

  const handleRemove = async (foodId: string) => {
    await removeFoodEntryFromSharedList(id, friendId!, foodId);
    await fetchSharedFoodEntries();
    closeDialog();
  };

  useEffect(() => {
    (async () => {
      const friend = await getUserById(friendId!);
      setFriend(friend);
      await fetchSharedFoodEntries();
    })();
  }, [friendId, fetchSharedFoodEntries]);

  const AddFoodFab = (
    <Fab
      onClick={() =>
        openDialog({
          titleText: "Add food",
          contentText: "What would you like to do?",
          primaryBtnIcon: <Add />,
          primaryBtnLabel: "Add from existing food",
          secondaryBtnIcon: <Edit />,
          secondaryBtnLabel: "Create new food",
          onPrimaryAction: () => {
            closeDialog();
            navigate(`/friend/${friendId}/shared-food-list/add-existing-food`);
          },
          onSecondaryAction: () => {
            closeDialog();
            navigate(`/my-food-list/create-food?share=${friendId}`);
          },
        })
      }
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

  const emptyPage = (
    <EmptyState
      image={emptyStateImages.sharedFoodList}
      heading="Start building your shared food list"
      textContent={`Add some food you'd love to share with ${friend?.name}, it'll make choosing together a breeze!`}
    />
  );

  // TO DO: loading

  return (
    <Box component="section">
      {sharedFoodEntries.length === 0 ? (
        emptyPage
      ) : (
        <Stack
          spacing={5}
          sx={{ alignItems: "center", pb: { xs: 10, sm: 12 } }}
        >
          {sharedFoodEntries.map((foodEntry: FoodEntry) => (
            <FoodCard
              key={foodEntry.id}
              foodEntry={foodEntry}
              variant={foodEntry.user_id === id ? "base" : "short"}
              onEdit={() => handleEdit(foodEntry.id!)}
              onDelete={() => handleDelete(foodEntry.id!)}
            />
          ))}
        </Stack>
      )}

      <AppDialog
        open={dialogOpen}
        titleText={dialogConfig.titleText}
        contentText={dialogConfig.contentText}
        onClose={closeDialog}
        primaryBtnLabel={dialogConfig.primaryBtnLabel}
        onPrimaryAction={dialogConfig.onPrimaryAction}
        secondaryBtnLabel={dialogConfig.secondaryBtnLabel}
        onSecondaryAction={dialogConfig.onSecondaryAction}
      />

      {AddFoodFab}
    </Box>
  );
}
