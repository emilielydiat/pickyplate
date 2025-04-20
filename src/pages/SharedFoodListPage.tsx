import { Typography } from "@mui/material";
import { SharedFoodListProvider } from "../context/SharedFoodListContext";
import { useFriendData } from "../hooks/useFriendData";
import { SharedFoodList } from "../components/SharedFoodList";

export function SharedFoodListPage() {
  const { friend } = useFriendData();

  if (!friend) return <Typography>Loading...</Typography>;

  return (
    <SharedFoodListProvider friendId={friend.id}>
      <SharedFoodList friend={friend} />
    </SharedFoodListProvider>
  );
}
