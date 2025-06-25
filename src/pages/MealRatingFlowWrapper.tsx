import { Typography } from "@mui/material";
import { Outlet, useOutletContext } from "react-router-dom";
import { MealSessionProvider } from "../context/MealSessionContext";
import { useFriendData } from "../hooks/useFriendData";
import { User } from "../data/mockData";

type ContextType = {
  friend: User;
};

export function MealRatingFlowWrapper() {
  const { friend } = useFriendData();

  if (!friend) return <Typography>Loading...</Typography>;

  return (
    <MealSessionProvider friendId={friend.id}>
      <Outlet context={{ friend }} />
    </MealSessionProvider>
  );
}

export function useFriend() {
  return useOutletContext<ContextType>();
}
