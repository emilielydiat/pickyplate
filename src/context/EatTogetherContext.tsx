import { createContext } from "react";
import { FoodEntry, MealSession, User } from "../types";

type Context = {
  friend: User;
  session: MealSession | null;
  sharedFoodList: FoodEntry[];
  reloadSession: () => Promise<void>;
};

export const EatTogetherContext = createContext<Context | null>(null);
