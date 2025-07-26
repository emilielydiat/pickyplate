import { createContext } from "react";
import { User } from "@supabase/auth-js/src/lib/types.ts";

type Context = {
  user: User | null;
  isLoading: boolean;
};

export const SupabaseUserContext = createContext<Context>({
  user: null,
  isLoading: false,
});
