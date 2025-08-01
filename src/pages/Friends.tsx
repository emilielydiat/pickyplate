import {
  Avatar,
  Box,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { emptyStateImages } from "../data/mockData";
import { usePageHeader } from "../hooks/usePageHeader";
import { EmptyState } from "../components/EmptyState";
import { constructAvatarURL } from "../utils/supabase";
import { useFriendsContext } from "../context/FriendsContext";

export function Friends() {
  usePageHeader("Friends", false);

  const { friends } = useFriendsContext();

  return (
    <Box component="section">
      {friends.length === 0 ? (
        <EmptyState
          image={emptyStateImages.friends}
          heading="Hungry for company?"
          textContent="Click the button below to add someone you want to share a meal with!"
        />
      ) : (
        <List>
          {friends.map((friend) => (
            <ListItem
              key={friend.id}
              component={Link}
              to={`/friend/${friend.id}`}
              aria-label={`View profile of ${friend.name}`}
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
            </ListItem>
          ))}
        </List>
      )}
      <Fab
        component={Link}
        to={`/friends/add-friend`}
        aria-label="Add friend"
        variant="extended"
        size="medium"
        color="primary"
        sx={{
          position: "fixed",
          bottom: { xs: 16, md: 24 },
          right: { xs: 16, md: "calc(50% - 450px + 24px)" },
          zIndex: 1050,
          cursor: "pointer",
        }}
      >
        <Add sx={{ mr: 1 }} />
        Add friend
      </Fab>
    </Box>
  );
}
