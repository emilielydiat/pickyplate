export type User = {
  id: string;
  created_at: number;
  name: string;
  email: string;
  avatar: string;
};

export type FriendRequest = {
  initiator_id: string;
  target_id: string;
};
