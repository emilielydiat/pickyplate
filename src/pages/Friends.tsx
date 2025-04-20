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
  const { friends } = useFriendsContext();
  const { setPageTitle } = usePageTitleContext();

  useEffect(() => {
    setPageTitle("Friends");
  });

  const sortedFriends = [...friends].sort((a, b) =>
    a.username.toLowerCase().localeCompare(b.username.toLowerCase())
  );

  return (
    <Box>
      <List>
        {sortedFriends.length === 0 ? (
          <Typography>
            You haven’t added any friends yet. <br /> Click on the button below
            to add one.
          </Typography>
        ) : (
          sortedFriends.map((friend) => (
            <ListItem
              key={friend.id}
              component={Link}
              to={`/friend/${friend.id}`}
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemAvatar>
                <Avatar src={friend.avatar} alt={friend.username} />
              </ListItemAvatar>
              <ListItemText primary={friend.username} />
            </ListItem>
          ))
        )}
      </List>
      {/* TO DO: Add friend FAB */}
    </Box>
  );
}
