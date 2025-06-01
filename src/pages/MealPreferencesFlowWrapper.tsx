import { Typography } from "@mui/material";
import { Outlet, useOutletContext } from "react-router-dom";
import { MealPreferencesDraftProvider } from "../context/MealPreferencesDraftContext";
import { SharedFoodListProvider } from "../context/SharedFoodListContext";
import { useFriendData } from "../hooks/useFriendData";
import { User } from "../data/mockData";

type ContextType = {
  friend: User;
};

export function MealPreferencesFlowWrapper() {
  const { friend } = useFriendData();

  if (!friend) return <Typography>Loading...</Typography>;

  return (
    <SharedFoodListProvider friendId={friend.id}>
      <MealPreferencesDraftProvider>
        <Outlet context={{ friend }} />
      </MealPreferencesDraftProvider>
    </SharedFoodListProvider>
  );
}

export function useFriend() {
  return useOutletContext<ContextType>();
}
