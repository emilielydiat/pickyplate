import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import supabase from "../supabase";
import { getUserById } from "../api/api";

type Props = {
  children: React.ReactNode;
};

type Context = {
  id: string;
  user: User | null;
};

const UserContext = createContext<Context | null>({ id: "", user: null });

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("No context found");
  }

  return context;
}

export function UserProvider({ children }: Props) {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isInitialised, setIsInitialised] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) return;

      const result = await getUserById(authUser.id);

      if (!result) return;

      setUserId(authUser.id);
      setUser(result);
    } finally {
      setIsInitialised(true);
    }
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (event === "SIGNED_IN") {
        void fetchCurrentUser();
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => void fetchCurrentUser(), []);

  if (!isInitialised) return "Loading";

  return (
    <UserContext.Provider value={{ id: userId, user }}>
      {children}
    </UserContext.Provider>
  );
}
