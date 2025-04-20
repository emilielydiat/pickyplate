import { createContext, useContext, useState, ReactNode } from "react";
import { mockUsers } from "../data/mockData";

type UserContextType = {
  avatar: string;
  setAvatar: (avatar: string) => void;
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("No context found");
  }
  return context;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [avatar, setAvatar] = useState(mockUsers.user_1.avatar);
  const [username, setUsername] = useState(mockUsers.user_1.username);
  const [email, setEmail] = useState(mockUsers.user_1.email);

  return (
    <UserContext.Provider
      value={{ avatar, setAvatar, username, setUsername, email, setEmail }}
    >
      {children}
    </UserContext.Provider>
  );
}
