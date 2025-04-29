import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useFriendsContext } from "../context/FriendsContext";
import { usePageTitleContext } from "../context/PageTitleContext";

export function Friends() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Friends");
  }, [setPageTitle]);

  const { friends } = useFriendsContext();

  const sortedFriends = [...friends].sort((a, b) =>
    a.username.toLowerCase().localeCompare(b.username.toLowerCase())
  );

  return (
    <Box component="section">
      {sortedFriends.length === 0 ? (
        <Typography component="h2" variant="body1">
          You haven’t added any friends yet. <br /> Click on the button below to
          add one.
        </Typography>
      ) : (
        <List>
          {sortedFriends.map((friend) => (
            <ListItem
              key={friend.id}
              component={Link}
              to={`/friend/${friend.id}`}
              aria-label={`View profile of ${friend.username}`}
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemAvatar>
                <Avatar
                  src={friend.avatar}
                  alt={`Avatar of ${friend.username}`}
                />
              </ListItemAvatar>
              <ListItemText primary={friend.username} />
            </ListItem>
          ))}
        </List>
      )}
      {/* TO DO: Add friend FAB */}
    </Box>
  );
}
