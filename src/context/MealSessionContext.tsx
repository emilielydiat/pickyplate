import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getMealSession } from "../api/api";
import { MealSession } from "../data/mockData";
import { useUserContext } from "../context/UserContext";

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
  const { id } = useUserContext();

  useEffect(() => {
    if (!id || !friendId) return;

    async function fetchMealSession() {
      const session = await getMealSession(id, friendId);
      setMealSession(session);
    }

    fetchMealSession();
  }, [id, friendId]);

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
