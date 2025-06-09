import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User } from "../data/mockData";
import { getUserDataById } from "../api/api";

export function useFriendData(passedFriendId?: string) {
  const params = useParams();
  const friendId = passedFriendId ?? params.friendId;

  const [friend, setFriend] = useState<User | null>(null);

  useEffect(() => {
    async function fetchFriendData() {
      if (friendId) {
        const friendData: User | null = await getUserDataById(friendId);
        setFriend(friendData);
      }
    }
    fetchFriendData();
  }, [friendId]);

  return { friend, friendId }; // also return friendId for flexibility
}
