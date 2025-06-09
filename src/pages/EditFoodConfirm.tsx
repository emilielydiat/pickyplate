import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useFoodDraftContext } from "../context/FoodDraftContext";
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

  const { draft } = useFoodDraftContext();
  const navigate = useNavigate();
  const friendData = useFriend();
  const friend = friendData?.friend;

  const handleSave = async () => {
    if (!draft || !draft.id) return;

    await updateFoodEntry(draft as FoodEntry);

    navigate(
      friend ? `/friend/${friend.id}/shared-food-list` : "/my-food-list"
    );
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
