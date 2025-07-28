import { Box, Fab, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useUserFoodListContext } from "../context/UserFoodListContext";
import { useFoodDraftContext } from "../context/FoodDraftContext";
import { FoodEntry, mockSharedFoodLists } from "../data/mockData";
import { updateMyFoodList } from "../api/api";
import { FoodCard } from "../components/FoodCard";
import { AppDialog } from "../components/AppDialog";
import { isFoodEntryUsedInSharedLists } from "../utils/foodUtils";
import { usePageHeader } from "../hooks/usePageHeader";

type DialogConfig = {
  titleText: string;
  contentText: string | React.ReactNode;
  confirmBtnLabel: string;
  cancelBtnLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose: () => void;
};

export function MyFoodList() {
  usePageHeader("My food list", false);

  const { id } = useUserContext();
  const navigate = useNavigate();
  const { setDraft } = useFoodDraftContext();
  const { userFoodEntries, setUserFoodEntries, sortedUserFoodEntries } =
    useUserFoodListContext();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const defaultDialogConfig: DialogConfig = {
    titleText: "",
    contentText: "",
    confirmBtnLabel: "",
    cancelBtnLabel: "",
    onConfirm: () => {},
    onCancel: () => {},
    onClose: () => {},
  };
  const [dialogConfig, setDialogConfig] =
    useState<DialogConfig>(defaultDialogConfig);

  async function deleteFoodEntryFromUserList(foodEntry: FoodEntry) {
    const updatedList: FoodEntry[] = userFoodEntries.filter(
      (entry) => entry.id !== foodEntry.id
    );

    setUserFoodEntries(updatedList);
    await updateMyFoodList(
      id,
      updatedList.map((entry) => entry.id)
    );
  }

  const handleDelete = async (foodEntry: FoodEntry) => {
    const isInUse = isFoodEntryUsedInSharedLists(
      id,
      foodEntry.id,
      mockSharedFoodLists
    );

    if (isInUse) {
      setDialogConfig({
        titleText: "Oops! This food is in use in your shared list",
        contentText: (
          <>
            You can't delete this food just yet because it's being used in one
            or more shared lists with your friends. <br /> <br /> To delete it,
            take it off those lists first!
          </>
        ),
        confirmBtnLabel: "Close",
        onConfirm: () => {
          setDialogOpen(false);
        },
        onClose: () => setDialogOpen(false),
      });
      setDialogOpen(true);
      return;
    } else {
      setDialogConfig({
        titleText: "Delete food?",
        contentText: (
          <>Once removed, this item will no longer appear in your food list</>
        ),
        confirmBtnLabel: "Delete",
        cancelBtnLabel: "Cancel",
        onConfirm: async () => {
          setDialogOpen(false);
          await deleteFoodEntryFromUserList(foodEntry);
        },
        onCancel: () => setDialogOpen(false),
        onClose: () => setDialogOpen(false),
      });
      setDialogOpen(true);
    }
  };

  const handleEdit = async (foodEntry: FoodEntry) => {
    setDraft(foodEntry);
    console.log("handleEdit ran");
    navigate(`/my-food-list/edit-food/${foodEntry.id}`);
  };

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
        withTextField={false}
        titleText={dialogConfig.titleText}
        contentText={dialogConfig.contentText}
        confirmBtnLabel={dialogConfig.confirmBtnLabel}
        cancelBtnLabel={dialogConfig.cancelBtnLabel}
        onClose={dialogConfig.onClose}
        onCancel={dialogConfig.onCancel}
        onConfirm={dialogConfig.onConfirm}
      />
    </Box>
  );
}
