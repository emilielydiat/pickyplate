import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentUserFoodList, createFoodEntry } from "../api/api";
import { FoodEntry } from "../data/mockData";
import { isValidFoodEntry } from "../utils/validators";
import { useUserContext } from "./UserContext";

type UserFoodListContextType = {
  userFoodEntries: FoodEntry[];
  sortedUserFoodEntries: FoodEntry[];
  setUserFoodEntries: React.Dispatch<React.SetStateAction<FoodEntry[]>>;
  addFoodEntry: (draft: Omit<FoodEntry, "id">) => Promise<void>;
  updateUserFoodEntry: (udpatedEntry: FoodEntry) => void;
  updateUserFoodList: () => Promise<void>;
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
  const { id } = useUserContext();

  const addFoodEntry = async (draft: Omit<FoodEntry, "id">) => {
    if (!id) {
      console.error("No current user found");
      return;
    }

    const newEntry = await createFoodEntry(id, draft);
    if (newEntry) {
      setUserFoodEntries((prev) => [...prev, newEntry]);
    }
  };

  const updateUserFoodList = async () => {
    if (id) {
      const updatedFoodList = await getCurrentUserFoodList(id);
      const validFoodList = updatedFoodList.filter(isValidFoodEntry);
      setUserFoodEntries(validFoodList);
    }
  };

  useEffect(() => {
    updateUserFoodList();
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
        updateUserFoodList,
      }}
    >
      {children}
    </UserFoodListContext.Provider>
  );
}
