import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentUser, getCurrentUserFoodList } from "../api/api";
import { FoodEntry } from "../data/mockData";

type UserFoodListContextType = {
  userFoodEntries: FoodEntry[];
  sortedUserFoodEntries: FoodEntry[];
  setUserFoodEntries: React.Dispatch<React.SetStateAction<FoodEntry[]>>;
};

const UserFoodListContext = createContext<UserFoodListContextType | null>(null);

export function useUserFoodListContext() {
  const context = useContext(UserFoodListContext);

  if (!context) {
    throw new Error(
      "useUserFoodListContext must be used within a UserFoodListProvider"
    );
  }
  return context;
}

export function UserFoodListProvider({ children }: { children: ReactNode }) {
  const [userFoodEntries, setUserFoodEntries] = useState<FoodEntry[]>([]);

  useEffect(() => {
    async function fetchUserFoodList() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const userFoodList = await getCurrentUserFoodList(currentUser.id);
        setUserFoodEntries(userFoodList);
      }
    }
    fetchUserFoodList();
  }, []);

  const sortedUserFoodEntries = useMemo(() => {
    return [...userFoodEntries].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }, [userFoodEntries]);

  return (
    <UserFoodListContext.Provider
      value={{ userFoodEntries, sortedUserFoodEntries, setUserFoodEntries }}
    >
      {children}
    </UserFoodListContext.Provider>
  );
}
