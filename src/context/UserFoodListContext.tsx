import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getCurrentUser,
  getCurrentUserFoodList,
  createFoodEntry,
} from "../api/api";
import { FoodEntry } from "../data/mockData";

type UserFoodListContextType = {
  userFoodEntries: FoodEntry[];
  sortedUserFoodEntries: FoodEntry[];
  setUserFoodEntries: React.Dispatch<React.SetStateAction<FoodEntry[]>>;
  addFoodEntry: (draft: Omit<FoodEntry, "id">) => Promise<void>;
  updateUserFoodEntry: (udpatedEntry: FoodEntry) => void;
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

  const addFoodEntry = async (draft: Omit<FoodEntry, "id">) => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.error("No current user found");
      return;
    }

    const newEntry = await createFoodEntry(currentUser.id, draft);
    if (newEntry) {
      setUserFoodEntries((prev) => [...prev, newEntry]);
    }
  };

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

  const updateUserFoodEntry = (updatedEntry: FoodEntry) => {
    setUserFoodEntries((prev) =>
      prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  };

  return (
    <UserFoodListContext.Provider
      value={{
        userFoodEntries,
        sortedUserFoodEntries,
        setUserFoodEntries,
        addFoodEntry,
        updateUserFoodEntry,
      }}
    >
      {children}
    </UserFoodListContext.Provider>
  );
}
