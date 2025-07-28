import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFoodDraftContext } from "../context/FoodDraftContext";
import { FoodEntry } from "../data/mockData";
import { FoodCard } from "../components/FoodCard";
import { useUserFoodListContext } from "../context/UserFoodListContext";
import { useSharedFoodListContext } from "../context/SharedFoodListContext";
import { useFriend } from "./FoodFlowWrapper";
import { usePageHeader } from "../hooks/usePageHeader";

export function CreateFoodConfirm() {
  usePageHeader("Review and save", true);

  const { draft, resetDraft } = useFoodDraftContext();
  const { addFoodEntry, updateUserFoodList } = useUserFoodListContext();
  const sharedFoodListContext = useSharedFoodListContext();
  const addSharedFoodEntry = sharedFoodListContext?.addSharedFoodEntry;
  const friendData = useFriend();
  const friend = friendData?.friend;
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!draft) return;
    if (!friend) {
      await addFoodEntry(draft as Omit<FoodEntry, "id">);
    } else {
      if (addSharedFoodEntry) {
        await addSharedFoodEntry(draft as Omit<FoodEntry, "id">); // also adds entry to both users' personal list
      }
    }
    await updateUserFoodList();
    resetDraft();

    if (!friend) {
      navigate("/my-food-list");
    } else {
      navigate(`/friend/${friend.id}/shared-food-list`);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "calc(100vh - 176px)",
      }}
    >
      <FoodCard foodEntry={draft as FoodEntry} variant="short" />
      <Box width="100%" display="flex" justifyContent="flex-end">
        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Create
        </Button>
      </Box>
    </Box>
  );
}
