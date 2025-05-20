import { createContext, useContext, useState, ReactNode } from "react";
import { MealPreferencesData } from "../data/mockData";

type MealPreferencesDraftContextType = {
  draft: MealPreferencesData | null;
  setDraft: React.Dispatch<React.SetStateAction<MealPreferencesData | null>>;
};

const MealPreferencesDraftContext =
  createContext<MealPreferencesDraftContextType | null>(null);

export function useMealPreferencesDraftContext() {
  const context = useContext(MealPreferencesDraftContext);

  if (!context) {
    throw new Error(
      "useMealPreferencesDraftContext must be used within a MealPreferencesDraftProvider"
    );
  }
  return context;
}

export function MealPreferencesDraftProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [draft, setDraft] = useState<MealPreferencesData | null>(null);

  return (
    <MealPreferencesDraftContext.Provider value={{ draft, setDraft }}>
      {children}
    </MealPreferencesDraftContext.Provider>
  );
}
