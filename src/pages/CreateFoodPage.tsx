// TO DO: Different create CreateFoodPage modes

// import { UserFoodListProvider } from "../context/UserFoodListContext";
// import { SharedFoodListProvider } from "../context/SharedFoodListContext";
// import { useFriendData } from "../hooks/useFriendData";
import { CreateFood } from "../components/CreateFood";

export function CreateFoodPage() {
  return <CreateFood />;

  // const { friend } = useFriendData();

  // if (!friend) return <Typography>Loading...</Typography>;

  // return (
  //   <UserFoodListProvider>
  //     <SharedFoodListProvider friendId={friend.id}>
  //       <CreateFood friend={friend} />
  //     </SharedFoodListProvider>
  //   </UserFoodListProvider>
  // );
}
