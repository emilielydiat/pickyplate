import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useFoodDraftContext } from "../context/FoodDraftContext";
import { useUserFoodListContext } from "../context/UserFoodListContext";
import { useSharedFoodListContext } from "../context/SharedFoodListContext";
import { FoodEntry } from "../data/mockData";
import { FoodCard } from "../components/FoodCard";
import { updateFoodEntry } from "../api/api";
import { useFriend } from "./FoodFlowWrapper";

export function EditFoodConfirm() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Review and save");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const { draft, setDraft } = useFoodDraftContext();
  const navigate = useNavigate();
  const friendData = useFriend();
  const friend = friendData?.friend;
  const { updateUserFoodEntry: updateUserFoodEntryInContext } =
    useUserFoodListContext();
  const sharedFoodListContext = useSharedFoodListContext();
  const updateSharedFoodEntryInContext =
    sharedFoodListContext?.updateSharedFoodEntry;

  const handleSave = async () => {
    if (!draft || !draft.id) return;

    const updatedEntry = await updateFoodEntry(draft as FoodEntry);

    if (!updatedEntry) {
      console.error("Failed to update food entry");
      return;
    }

    if (friend && updateSharedFoodEntryInContext) {
      updateSharedFoodEntryInContext(updatedEntry);
      navigate(`/friend/${friend.id}/shared-food-list`);
    } else {
      updateUserFoodEntryInContext(updatedEntry);
      navigate("/my-food-list");
    }

    setDraft(null);
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
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mb: 2 }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
