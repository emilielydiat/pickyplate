import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { getCurrentUser } from "../api/api";

type UserContextType = {
  avatar: string;
  setAvatar: (avatar: string) => void;
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  id: string;
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
  const [avatar, setAvatar] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [id, setId] = useState<string>("");

  useEffect(() => {
    async function fetchCurrentUser() {
      const user = await getCurrentUser();
      if (user) {
        setAvatar(user.avatar);
        setUsername(user.username);
        setEmail(user.email);
        setId(user.id);
      }
    }
    fetchCurrentUser();
  }, []);

  const value = useMemo(
    () => ({
      avatar,
      setAvatar,
      username,
      setUsername,
      email,
      setEmail,
      id,
    }),
    [avatar, username, email, id]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
