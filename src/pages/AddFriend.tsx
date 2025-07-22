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
import { useNavigate } from "react-router-dom";
import { User } from "../data/mockData";
import { usePageTitleContext } from "../context/PageTitleContext";
import { addFriend, getUsersNotFriendsWith } from "../api/api";
import { useUserContext } from "../context/UserContext";
import { useFriendsContext } from "../context/FriendsContext";
import { AppDialog } from "../components/AppDialog";

export function AddFriend() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Add friend");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const navigate = useNavigate();
  const { id } = useUserContext();
  const { updateFriends } = useFriendsContext();
  const [searchInput, setSearchInput] = useState<string>("");
  const [nonFriendUsers, setNonFriendUsers] = useState<User[]>([]);
  const [addedUserIds, setAddedUserIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
      setAddedUserIds((prev) => [...prev, friendId]);
      await updateFriends();
      setDialogOpen(true);
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
                sx={{ px: 0, textDecoration: "none", color: "inherit" }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={user.avatar}
                    alt={`Avatar of ${user.username}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  sx={{ pr: 2, wordBreak: "break-word" }}
                />
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
      <AppDialog
        open={dialogOpen}
        withTextField={false}
        titleText="Friend request sent"
        contentText={
          <>
            {/* TO DO (after friend request management set): */}
            {/*Track it in Requests page. You’ll be able to decide what to eat
            together once they accept.
            <br /> <br />*/}
            In the meantime, why not build your food list? It’ll make choosing
            easier later!
          </>
        }
        confirmBtnLabel="Build my food list"
        cancelBtnLabel="Not now"
        onClose={() => setDialogOpen(false)}
        onConfirm={() => {
          setDialogOpen(false);
          navigate("/my-food-list");
        }}
        onCancel={() => setDialogOpen(false)}
      />
    </Box>
  );
}
