import { Outlet, useOutletContext } from "react-router-dom";
import { FoodDraftProvider } from "../context/FoodDraftContext";
import { UserFoodListProvider } from "../context/UserFoodListContext";
import { SharedFoodListProvider } from "../context/SharedFoodListContext";
import { useFriendData } from "../hooks/useFriendData";
import { User } from "../data/mockData";

type ContextType = {
  friend: User;
};

export function FoodFlowWrapper() {
  const { friend } = useFriendData();

  return (
    <UserFoodListProvider>
      {friend ? (
        <SharedFoodListProvider friendId={friend.id}>
          <FoodDraftProvider>
            <Outlet context={{ friend }} />
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
