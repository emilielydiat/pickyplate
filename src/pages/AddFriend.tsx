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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { emptyStateImages } from "../data/mockData";
import { addFriend, searchUsers } from "../api/api";
import { AppDialog } from "../components/AppDialog";
import { usePageHeader } from "../hooks/usePageHeader";
import { EmptyState } from "../components/EmptyState";
import { constructAvatarURL } from "../utils/supabase";
import { User } from "../types";
import { useFriendsContext } from "../context/FriendsContext";
import { useUserContext } from "../context/UserContext";

export function AddFriend() {
  usePageHeader("Add friend", true);

  const navigate = useNavigate();
  const { id: currentUserId } = useUserContext();
  const {
    friends,
    requests,
    reload: reloadFriendsAndRequests,
  } = useFriendsContext();

  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddFriend = async (userId: string) => {
    try {
      await addFriend(userId);
      await reloadFriendsAndRequests();
      setDialogOpen(true);
    } catch (e) {
      console.error("Failed to send friend request: ", e);
    }
  };

  const isUserFriend = (userId: string) =>
    friends.findIndex((f) => f.id === userId) >= 0 ||
    requests.findIndex((r) => r.target_id === userId) >= 0;

  useEffect(() => {
    // TODO: Implement debounce
    if (!searchInput) {
      setResults([]);
      return;
    }

    (async () => {
      const result = await searchUsers(searchInput);
      setResults(result.filter((r) => r.id !== currentUserId));
    })();
  }, [searchInput]);

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
            Start typing your friend's name
          </Typography>
        )}

        {results.length === 0 && searchInput.trim() && (
          <EmptyState
            image={emptyStateImages.addFriend}
            heading="Hmm... didn't find anyone"
            textContent="Are they registered yet? If not, invite them!"
          />
        )}

        {results.length !== 0 && (
          <List>
            {results.map((user) => (
              <ListItem
                key={user.id}
                sx={{ px: 0, textDecoration: "none", color: "inherit" }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={constructAvatarURL(user.avatar)}
                    alt={`Avatar of ${user.name}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  sx={{ pr: 2, wordBreak: "break-word" }}
                />
                <Button
                  aria-label={`Add ${user.name} as friend`}
                  variant="contained"
                  disabled={isUserFriend(user.id)}
                  onClick={() => handleAddFriend(user.id)}
                  sx={{ cursor: "pointer" }}
                >
                  {isUserFriend(user.id) ? "Added" : "Add"}
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
      <AppDialog
        open={dialogOpen}
        withTextField={false}
        titleText="Friend request sent!"
        contentText={
          <>
            Once they accept, you'll be able to start planning meals with your
            friend
          </>
        }
        primaryBtnLabel="View in Requests"
        secondaryBtnLabel="Close"
        onClose={() => setDialogOpen(false)}
        onPrimaryAction={() => {
          setDialogOpen(false);
          navigate("/requests");
        }}
        onSecondaryAction={() => setDialogOpen(false)}
      />
    </Box>
  );
}
