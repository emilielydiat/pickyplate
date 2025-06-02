import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createContext, ReactNode } from "react";

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Create Supabase instance
const supabase = createClient(supabaseUrl, supabaseKey);

type Context = {
  supabase: SupabaseClient;
};

export const SupabaseContext = createContext<Context>({ supabase });

export function SupabaseProvider({ children }: { children: ReactNode }) {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}
