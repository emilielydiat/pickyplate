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
import { Link } from "react-router-dom";
import { User } from "../data/mockData";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useUserContext } from "../context/UserContext";
import { useFriendsContext } from "../context/FriendsContext";

export function PickFriend() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Pick a friend");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const { id } = useUserContext();
  const { friends } = useFriendsContext();
  const [searchInput, setSearchInput] = useState<string>("");

  const filteredFriends: User[] = useMemo(() => {
    const input = searchInput.toLowerCase();
    if (input) {
      return friends.filter((friend) =>
        friend.username.toLowerCase().includes(input)
      );
    } else {
      return [];
    }
  }, [searchInput, friends]);

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
            Start typing your friend's username
          </Typography>
        )}

        {filteredFriends.length === 0 && searchInput.trim() && (
          <Typography component="p" variant="body1">
            No friends found.
            <br /> Try a different spelling or invite them to join!
          </Typography>
        )}

        {filteredFriends.length !== 0 && (
          <List>
            {filteredFriends.map((friend) => (
              <ListItem
                key={friend.id}
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={friend.avatar}
                    alt={`Avatar of ${friend.username}`}
                  />
                </ListItemAvatar>
                <ListItemText primary={friend.username} />
                <Button
                  component={Link}
                  to={`/eat-together/${id}/${friend.id}/meal-preferences`}
                  aria-label={`Eat together with ${friend.username}`}
                  variant="contained"
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
