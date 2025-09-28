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
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { emptyStateImages } from "../data/mockData";
import { useFriendsContext } from "../context/FriendsContext";
import { usePageHeader } from "../hooks/usePageHeader";
import { EmptyState } from "../components/EmptyState";
import { constructAvatarURL } from "../utils/supabase";
import { User } from "../types";

export function PickFriend() {
  usePageHeader("Pick a friend", true);

  const navigate = useNavigate();
  const { friends } = useFriendsContext();
  const [searchInput, setSearchInput] = useState<string>("");

  const filteredFriends: User[] = useMemo(() => {
    const input = searchInput.toLowerCase();
    if (input) {
      return friends.filter((friend) =>
        friend.name.toLowerCase().includes(input),
      );
    } else {
      return [];
    }
  }, [searchInput, friends]);

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
                  aria-label={`Eat together with ${friend.name}`}
                  variant="contained"
                  type="button"
                  onClick={() => navigate(`/eat-together/${friend.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  Eat together
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </Box>
  );
}
