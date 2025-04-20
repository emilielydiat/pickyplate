import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentUser, getCurrentUserFriends } from "../api/api";
import { User } from "../data/mockData";

type FriendsContextType = {
  friends: User[];
  setFriends: React.Dispatch<React.SetStateAction<User[]>>;
};

const FriendsContext = createContext<FriendsContextType | null>(null);

export function useFriendsContext() {
  const context = useContext(FriendsContext);

  if (!context) {
    throw new Error("useFriendsContext must be used within a FriendsProvider");
  }
  return context;
}

export function FriendsProvider({ children }: { children: ReactNode }) {
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    async function fetchFriends() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const friendsList = await getCurrentUserFriends(currentUser.id);
        setFriends(friendsList);
      }
    }
    fetchFriends();
  }, []);

  return (
    <FriendsContext.Provider value={{ friends, setFriends }}>
      {children}
    </FriendsContext.Provider>
  );
}
