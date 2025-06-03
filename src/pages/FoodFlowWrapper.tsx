import { Outlet } from "react-router-dom";
import { FoodDraftProvider } from "../context/FoodDraftContext";
import { UserFoodListProvider } from "../context/UserFoodListContext";

export function FoodFlowWrapper() {
  return (
    <UserFoodListProvider>
      <FoodDraftProvider>
        <Outlet />
      </FoodDraftProvider>
    </UserFoodListProvider>
  );
}
