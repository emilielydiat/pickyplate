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
import { useState, useEffect, useCallback } from "react";
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
import { useDialogManager } from "../hooks/useDialogManager";

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
  const { dialogOpen, dialogConfig, openDialog, closeDialog } =
    useDialogManager();

  const handleAddFriend = async (userId: string) => {
    try {
      await addFriend(userId);
      await reloadFriendsAndRequests();
      openDialog({
        titleText: "Friend request sent!",
        contentText:
          "Once they accept, you'll be able to start planning meals with your friend",
        primaryBtnLabel: "View in Requests",
        secondaryBtnLabel: "Close",
        onPrimaryAction: () => {
          closeDialog();
          navigate("/requests");
        },
        onSecondaryAction: closeDialog,
      });
    } catch (e) {
      console.error("Failed to send friend request: ", e);
    }
  };

  const isUserPending = useCallback(
    (userId: string) => requests.findIndex((r) => r.target_id === userId) >= 0,
    [requests]
  );

  const isUserFriend = useCallback(
    (userId: string) => friends.findIndex((f) => f.id === userId) >= 0,
    [friends]
  );

  useEffect(() => {
    // TODO: Implement debounce
    if (!searchInput) {
      setResults([]);
      return;
    }

    (async () => {
      const result = await searchUsers(searchInput);
      setResults(
        result.filter((r) => r.id !== currentUserId && !isUserFriend(r.id))
      );
    })();
  }, [searchInput, currentUserId, isUserFriend]);

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
                  aria-label={
                    isUserPending(user.id)
                      ? `${user.name} is pending approval`
                      : `Add ${user.name} as friend`
                  }
                  variant="contained"
                  disabled={isUserPending(user.id)}
                  onClick={() => handleAddFriend(user.id)}
                  sx={{ cursor: "pointer" }}
                >
                  {isUserPending(user.id) ? "Pending" : "Add"}
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
      <AppDialog
        open={dialogOpen}
        titleText={dialogConfig.titleText}
        contentText={dialogConfig.contentText}
        onClose={closeDialog}
        primaryBtnLabel={dialogConfig.primaryBtnLabel}
        onPrimaryAction={dialogConfig.onPrimaryAction}
        secondaryBtnLabel={dialogConfig.secondaryBtnLabel}
        onSecondaryAction={dialogConfig.onSecondaryAction}
      />
    </Box>
  );
}
