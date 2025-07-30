import { createContext } from "react";
import { User } from "../types.ts";

type Context = {
  user: User | null;
  isInitialised: boolean;
};

export const SupabaseUserContext = createContext<Context>({
  user: null,
  isInitialised: false,
});
