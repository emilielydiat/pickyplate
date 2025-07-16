import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentUserFriends } from "../api/api";
import { User } from "../data/mockData";
import { useUserContext } from "../context/UserContext";

type FriendsContextType = {
  friends: User[];
  setFriends: React.Dispatch<React.SetStateAction<User[]>>;
  updateFriends: () => Promise<void>;
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
  const { id } = useUserContext();

  useEffect(() => {
    async function fetchFriends() {
      if (id) {
        const friendsList = await getCurrentUserFriends(id);
        setFriends(friendsList);
      }
    }
    fetchFriends();
  }, [id]);

  const updateFriends = async () => {
    if (id) {
      const friendList = await getCurrentUserFriends(id);
      setFriends(friendList);
    }
  };

  return (
    <FriendsContext.Provider value={{ friends, setFriends, updateFriends }}>
      {children}
    </FriendsContext.Provider>
  );
}
