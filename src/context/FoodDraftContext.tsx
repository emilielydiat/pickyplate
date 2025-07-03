import { createContext, useContext, useState, ReactNode } from "react";
import { FoodEntry } from "../data/mockData";

type FoodDraftContextType = {
  draft: Partial<FoodEntry> | null;
  setDraft: React.Dispatch<React.SetStateAction<Partial<FoodEntry> | null>>;
};

const FoodDraftContext = createContext<FoodDraftContextType | null>(null);

export function useFoodDraftContext() {
  const context = useContext(FoodDraftContext);

  if (!context) {
    throw new Error("FoodDraftContext must be used within a FoodDraftProvider");
  }
  return context;
}

export function FoodDraftProvider({ children }: { children: ReactNode }) {
  const initialDraft: Partial<FoodEntry> = {
    name: "",
    type: [],
    location: [],
    price: undefined,
    maxTime: undefined,
    cuisine: [],
  };

  const [draft, setDraft] = useState<Partial<FoodEntry> | null>(initialDraft);

  return (
    <FoodDraftContext.Provider value={{ draft, setDraft }}>
      {children}
    </FoodDraftContext.Provider>
  );
}
