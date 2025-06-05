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

  const { draft } = useFoodDraftContext();
  const { addFoodEntry } = useUserFoodListContext();
  const { addSharedFoodEntry } = useSharedFoodListContext();
  const { friend } = useFriend();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!draft) return;
    if (!friend) {
      await addFoodEntry(draft as Omit<FoodEntry, "id">);
      navigate("/my-food-list");
    } else {
      await addSharedFoodEntry(draft as Omit<FoodEntry, "id">); // also adds entry to both users' personal list
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
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
