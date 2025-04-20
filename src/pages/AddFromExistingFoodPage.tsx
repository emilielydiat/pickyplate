import { Typography } from "@mui/material";
import { useFriendData } from "../hooks/useFriendData";
import { UserFoodListProvider } from "../context/UserFoodListContext";
import { SharedFoodListProvider } from "../context/SharedFoodListContext";
import { AddFromExistingFood } from "../components/AddFromExistingFood";

export function AddFromExistingFoodPage() {
  const { friend } = useFriendData();

  if (!friend) return <Typography>Loading...</Typography>;

  return (
    <UserFoodListProvider>
      <SharedFoodListProvider friendId={friend.id}>
        <AddFromExistingFood friend={friend} />
      </SharedFoodListProvider>
    </UserFoodListProvider>
  );
}
