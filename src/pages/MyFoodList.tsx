import { Box, Fab, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { emptyStateImages } from "../data/mockData";
import { deleteFoodEntry, getFoodList } from "../api/api";
import { FoodCard } from "../components/FoodCard";
import { AppDialog } from "../components/AppDialog";
import { usePageHeader } from "../hooks/usePageHeader";
import { EmptyState } from "../components/EmptyState";
import { FoodEntry } from "../types";
import { useDialogManager } from "../hooks/useDialogManager";

export function MyFoodList() {
  usePageHeader("My food list", false);
  const navigate = useNavigate();
  const { id } = useUserContext();
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);

  const { dialogOpen, dialogConfig, openDialog, closeDialog } =
    useDialogManager();

  const fetchFoodList = useCallback(async () => {
    const result = await getFoodList(id);
    setFoodEntries(result);
  }, [id]);

  const handleDelete = async (foodEntry: FoodEntry) => {
    openDialog({
      titleText: "Delete food?",
      contentText:
        "Once removed, this item will no longer appear in your food list",
      primaryBtnLabel: "Delete",
      secondaryBtnLabel: "Cancel",
      onPrimaryAction: async () => {
        try {
          await deleteFoodEntry(foodEntry.id!);
        } catch (e) {
          const message =
            e instanceof Error
              ? e.message
              : "Something went wrong. Please try again.";

          openDialog({
            titleText: "Error",
            contentText: message,
            primaryBtnLabel: "Okay",
            onPrimaryAction: closeDialog,
          });
          return;
        }
        await fetchFoodList();
        closeDialog();
      },
      onSecondaryAction: closeDialog,
    });
  };

  const handleEdit = async (foodEntry: FoodEntry) => {
    navigate(`/my-food-list/edit-food/${foodEntry.id}`);
  };

  useEffect(() => {
    void fetchFoodList();
  }, [fetchFoodList]);

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
  if (foodEntries.length === 0) {
    return (
      <Box component="section">
        <EmptyState
          image={emptyStateImages.myFoodList}
          heading="Start your food list"
          textContent="Add a few favourites, so deciding what to eat together is easier later!"
        />
        {AddFoodFab}
      </Box>
    );
  }

  return (
    <Box component="section">
      <Stack spacing={5} sx={{ alignItems: "center", pb: { xs: 10, sm: 12 } }}>
        {foodEntries.map((foodEntry) => (
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
      <AppDialog
        open={dialogOpen}
        titleText={dialogConfig.titleText}
        contentText={dialogConfig.contentText}
        primaryBtnLabel={dialogConfig.primaryBtnLabel}
        secondaryBtnLabel={dialogConfig.secondaryBtnLabel}
        onClose={closeDialog}
        onSecondaryAction={dialogConfig.onSecondaryAction}
        onPrimaryAction={dialogConfig.onPrimaryAction}
      />
    </Box>
  );
}
