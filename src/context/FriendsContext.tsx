import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentUserFriends, getFriendRequests } from "../api/api";
import { FriendRequest, User } from "../types";
import { useUserContext } from "./UserContext";

type FriendsContextType = {
  friends: User[];
  requestUsers: User[];
  requests: FriendRequest[];
  isLoading: boolean;
  reload: () => Promise<void>;
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
  const { id } = useUserContext();

  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [requestUsers, setRequestUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFriendsAndRequests = async () => {
    try {
      setIsLoading(true);
      const _friends = await getCurrentUserFriends();
      const { requests: _requests, users } = await getFriendRequests();
      setFriends(_friends);
      setRequests(_requests);
      setRequestUsers(users);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    void fetchFriendsAndRequests();
  }, [id]);

  return (
    <FriendsContext.Provider
      value={{
        friends,
        requests,
        requestUsers,
        isLoading,
        reload: fetchFriendsAndRequests,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
}
