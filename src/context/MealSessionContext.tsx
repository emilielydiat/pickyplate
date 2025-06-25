import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentUser, getMealSession } from "../api/api";
import { MealSession } from "../data/mockData";

type MealSessionContextType = {
  mealSession: MealSession | null;
  setMealSession: React.Dispatch<React.SetStateAction<MealSession | null>>;
};

const MealSessionContext = createContext<MealSessionContextType | null>(null);

export function useMealSessionContext() {
  const context = useContext(MealSessionContext);

  if (!context) {
    throw new Error(
      "useMealSessionContext must be used within a MealSessionProvider"
    );
  }
  return context;
}

export function MealSessionProvider({
  friendId,
  children,
}: {
  friendId: string;
  children: ReactNode;
}) {
  const [mealSession, setMealSession] = useState<MealSession | null>(null);

  useEffect(() => {
    if (!friendId) return;

    async function fetchMealSession() {
      const currentUser = await getCurrentUser();

      if (!currentUser || !friendId) return;

      const session = await getMealSession(currentUser.id, friendId);
      setMealSession(session);
    }
    fetchMealSession();
  }, [friendId]);

  return (
    <MealSessionContext.Provider
      value={{
        mealSession,
        setMealSession,
      }}
    >
      {children}
    </MealSessionContext.Provider>
  );
}
