import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useFoodDraftContext } from "../context/FoodDraftContext";
import { FoodEntry } from "../data/mockData";
import { FoodCard } from "../components/FoodCard";
import { useUserFoodListContext } from "../context/UserFoodListContext";
import { useSharedFoodListContext } from "../context/SharedFoodListContext";
import { useFriend } from "./FoodFlowWrapper";

export function CreateFoodConfirm() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Review and save");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const { draft, resetDraft } = useFoodDraftContext();
  const { addFoodEntry } = useUserFoodListContext();
  const sharedFoodListContext = useSharedFoodListContext();
  const addSharedFoodEntry = sharedFoodListContext?.addSharedFoodEntry;
  const friendData = useFriend();
  const friend = friendData?.friend;
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!draft) return;
    if (!friend) {
      await addFoodEntry(draft as Omit<FoodEntry, "id">);
      resetDraft();
      navigate("/my-food-list");
    } else {
      if (addSharedFoodEntry) {
        await addSharedFoodEntry(draft as Omit<FoodEntry, "id">); // also adds entry to both users' personal list
        resetDraft();
        navigate(`/friend/${friend.id}/shared-food-list`);
      }
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
