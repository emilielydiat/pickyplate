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
  getSharedFoodList,
  createSharedFoodEntry,
} from "../api/api";
import { FoodEntry } from "../data/mockData";
import { isValidFoodEntry } from "../utils/validators";

type SharedFoodListContextType = {
  sharedFoodEntries: FoodEntry[];
  sortedSharedFoodEntries: FoodEntry[];
  setSharedFoodEntries: React.Dispatch<React.SetStateAction<FoodEntry[]>>;
  addSharedFoodEntry?: (
    draft: Omit<FoodEntry, "id">
  ) => Promise<FoodEntry | null>;
  updateSharedFoodEntry: (updatedEntry: FoodEntry) => void;
};

const SharedFoodListContext = createContext<SharedFoodListContextType | null>(
  null
);

export function useSharedFoodListContext() {
  const context = useContext(SharedFoodListContext);

  if (!context) {
    console.log("No SharedFoodListContext provider");
    return undefined; // no error throwing for pages designed not to have SharedFoodListProvider
  }
  return context;
}

export function SharedFoodListProvider({
  friendId,
  children,
}: {
  friendId: string;
  children: ReactNode;
}) {
  const [sharedFoodEntries, setSharedFoodEntries] = useState<FoodEntry[]>([]);

  useEffect(() => {
    if (!friendId) {
      return;
    }

    async function fetchSharedFoodList() {
      const currentUser = await getCurrentUser();

      if (!currentUser || !friendId) return;

      const sharedFoodList = await getSharedFoodList(currentUser.id, friendId);
      const validSharedFoodList = sharedFoodList.filter(isValidFoodEntry);
      setSharedFoodEntries(validSharedFoodList);
    }
    fetchSharedFoodList();
  }, [friendId]);

  const addSharedFoodEntry = async (
    draft: Omit<FoodEntry, "id">
  ): Promise<FoodEntry | null> => {
    const currentUser = await getCurrentUser();
    if (!currentUser || !friendId) return null;

    const newEntry = await createSharedFoodEntry(
      currentUser.id,
      friendId,
      draft
    );
    if (newEntry) {
      setSharedFoodEntries((prev) => [...prev, newEntry]);
    }

    return newEntry;
  };

  const sortedSharedFoodEntries = useMemo(() => {
    return [...sharedFoodEntries].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }, [sharedFoodEntries]);

  const updateSharedFoodEntry = (updatedEntry: FoodEntry) => {
    setSharedFoodEntries((prev) =>
      prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
  };

  return (
    <SharedFoodListContext.Provider
      value={{
        sharedFoodEntries,
        sortedSharedFoodEntries,
        setSharedFoodEntries,
        addSharedFoodEntry,
        updateSharedFoodEntry,
      }}
    >
      {children}
    </SharedFoodListContext.Provider>
  );
}
