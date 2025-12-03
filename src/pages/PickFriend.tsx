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
import { Add } from "@mui/icons-material";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { emptyStateImages } from "../data/mockData";
import { useFriendsContext } from "../context/FriendsContext";
import { usePageHeader } from "../hooks/usePageHeader";
import { EmptyState } from "../components/EmptyState";
import { constructAvatarURL } from "../utils/supabase";
import { User } from "../types";
import { AppDialog } from "../components/AppDialog";
import { useDialogManager } from "../hooks/useDialogManager";

export function PickFriend() {
  usePageHeader("Pick a friend", true);
  const { dialogOpen, dialogConfig, openDialog, closeDialog } =
    useDialogManager();
  const navigate = useNavigate();
  const canGoBack = window.history.length > 1;

  const handleDialogClose = useCallback(() => {
    closeDialog();
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [closeDialog, canGoBack, navigate]);

  const { friends } = useFriendsContext();
  const [searchInput, setSearchInput] = useState<string>("");

  const filteredFriends: User[] = useMemo(() => {
    const input = searchInput.toLowerCase();
    if (input) {
      return friends.filter((friend) =>
        friend.name.toLowerCase().includes(input)
      );
    } else {
      return [];
    }
  }, [searchInput, friends]);

  useEffect(() => {
    if (friends.length === 0) {
      openDialog({
        titleText: "Oops, no friends to eat with",
        contentText:
          "Your friend list is empty!\nAdd a friend to explore your next meal together.",
        primaryBtnLabel: "Add a friend",
        secondaryBtnLabel: "Close",
        onPrimaryAction: () => {
          closeDialog();
          navigate("/friends/add-friend");
        },
        onSecondaryAction: handleDialogClose,
      });
    }
  }, [friends, closeDialog, handleDialogClose, navigate, openDialog]);

  return (
    <Box component="section">
      <Stack spacing={2}>
        <TextField
          label="Search friend"
          variant="outlined"
          type="search"
          fullWidth
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        {!searchInput.trim() && (
          <Typography component="p" variant="body1">
            Start typing your friend's username
          </Typography>
        )}

        {filteredFriends.length === 0 && searchInput.trim() && (
          <EmptyState
            image={emptyStateImages.pickAFriend}
            heading="Can't find that friend"
            textContent="Try another name or add them to your friend list!"
            button={
              <Button
                startIcon={<Add />}
                variant="contained"
                onClick={() => navigate("/friends/add-friend")}
              >
                Add friend
              </Button>
            }
          />
        )}

        {filteredFriends.length !== 0 && (
          <List>
            {filteredFriends.map((friend) => (
              <ListItem
                key={friend.id}
                sx={{ px: 0, textDecoration: "none", color: "inherit" }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={constructAvatarURL(friend.avatar)}
                    alt={`Avatar of ${friend.name}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={friend.name}
                  sx={{ pr: 2, wordBreak: "break-word" }}
                />
                <Button
                  component={Link}
                  to={`/eat-together/${friend.id}`}
                  state={{ from: "/pick-friend" }}
                  aria-label={`Eat together with ${friend.name}`}
                  variant="contained"
                  type="button"
                  sx={{ cursor: "pointer" }}
                >
                  Eat together
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
        onClose={handleDialogClose}
        primaryBtnLabel={dialogConfig.primaryBtnLabel}
        secondaryBtnLabel={dialogConfig.secondaryBtnLabel}
        onSecondaryAction={dialogConfig.onSecondaryAction}
        onPrimaryAction={dialogConfig.onPrimaryAction}
      />
    </Box>
  );
}
