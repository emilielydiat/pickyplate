import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { User } from "../data/mockData";
import { usePageTitleContext } from "../context/PageTitleContext";
import {
  addFriend,
  getUsersNotFriendsWith,
  getCurrentUserFriends,
} from "../api/api";
import { useUserContext } from "../context/UserContext";
import { useFriendsContext } from "../context/FriendsContext";

export function AddFriend() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Add friend");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const { id } = useUserContext();
  const { setFriends } = useFriendsContext();
  const [searchInput, setSearchInput] = useState<string>("");
  const [nonFriendUsers, setNonFriendUsers] = useState<User[]>([]);
  const [addedUserIds, setAddedUserIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchNonFriendUsers() {
      const result = await getUsersNotFriendsWith(id);
      setNonFriendUsers(result);
    }
    fetchNonFriendUsers();
  }, [id]);

  const filteredUsers: User[] = useMemo(() => {
    const input = searchInput.toLowerCase();
    if (input) {
      return nonFriendUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(input) ||
          user.email.toLowerCase().includes(input)
      );
    } else {
      return [];
    }
  }, [searchInput, nonFriendUsers]);

  const handleAddFriend = async (friendId: string) => {
    const wasAdded = await addFriend(id, friendId);
    if (wasAdded) {
      const friends = await getCurrentUserFriends(id);
      setFriends(friends);
      setAddedUserIds((prev) => [...prev, friendId]);
    }
  };

  return (
    <Box component="section">
      <Stack spacing={2}>
        <TextField
          type="search"
          label="Search friend"
          variant="outlined"
          fullWidth
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        ></TextField>

        {!searchInput.trim() && (
          <Typography component="p" variant="body1">
            Start typing your friend's username or email
          </Typography>
        )}

        {filteredUsers.length === 0 && searchInput.trim() && (
          <Typography component="p" variant="body1">
            No friends found.
            <br /> Try a different spelling or invite them to join!
          </Typography>
        )}

        {filteredUsers.length !== 0 && (
          <List>
            {filteredUsers.map((user) => (
              <ListItem
                key={user.id}
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={user.avatar}
                    alt={`Avatar of ${user.username}`}
                  />
                </ListItemAvatar>
                <ListItemText primary={user.username} />
                <Button
                  aria-label={`Add ${user.username} as friend`}
                  variant="contained"
                  disabled={addedUserIds.includes(user.id)}
                  onClick={() => handleAddFriend(user.id)}
                  sx={{ cursor: "pointer" }}
                >
                  {addedUserIds.includes(user.id) ? "Added" : "Add"}
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </Box>
  );
}
