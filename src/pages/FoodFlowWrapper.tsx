import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { FoodDraftProvider } from "../context/FoodDraftContext";
import { UserFoodListProvider } from "../context/UserFoodListContext";
import { SharedFoodListProvider } from "../context/SharedFoodListContext";
import { useFriendData } from "../hooks/useFriendData";
import { User } from "../data/mockData";

type ContextType = {
  friend: User;
};

export function FoodFlowWrapper() {
  const { friendId } = useParams();
  const { friend } = useFriendData(friendId);

  return (
    <UserFoodListProvider>
      {friendId ? (
        <SharedFoodListProvider friendId={friendId}>
          <FoodDraftProvider>
            {friend ? <Outlet context={{ friend }} /> : "Loading"}
          </FoodDraftProvider>
        </SharedFoodListProvider>
      ) : (
        <FoodDraftProvider>
          <Outlet />
        </FoodDraftProvider>
      )}
    </UserFoodListProvider>
  );
}

export function useFriend() {
  return useOutletContext<ContextType>();
}
