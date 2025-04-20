import { UserFoodListProvider } from "../context/UserFoodListContext";
import { MyFoodList } from "../components/MyFoodList";

export function MyFoodListPage() {
  return (
    <UserFoodListProvider>
      <MyFoodList />
    </UserFoodListProvider>
  );
}
