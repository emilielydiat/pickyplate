import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { Mood, Restaurant, Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useFriendData } from "../hooks/useFriendData";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useUserContext } from "../context/UserContext";

export function FriendProfile() {
  const { friend } = useFriendData();
  const { setPageTitle } = usePageTitleContext();
  const { id } = useUserContext();

  useEffect(() => {
    setPageTitle(null);
  }, [setPageTitle]);

  // TO DO: loading
  if (!friend) {
    return (
      <Typography component="h2" variant="body1">
        Loading friend profile...
      </Typography>
    );
  }

  function handleRemoveFriend() {
    // TO DO
  }

  return (
    <Box
      component="section"
      aria-label={`Profile of ${friend.username}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 10,
      }}
    >
      <Avatar
        src={friend.avatar}
        alt={`Avatar of ${friend.username}`}
        sx={{ width: "112px", height: "112px", mb: 3 }}
      />
      <Typography component="h2" variant="h6Branded">
        {friend.username}
      </Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: "320px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 10,
        }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Button
            component={Link}
            to={`/eat-together/${friend.id}/meal-preferences`}
            aria-label={`Eat together with ${friend.username}`}
            startIcon={<Mood />}
            variant="outlined"
            sx={{ width: "100%" }}
          >
            Eat together
          </Button>
          <Button
            component={Link}
            to={`/friend/${friend.id}/shared-food-list`}
            aria-label={`Edit shared food list with ${friend.username}`}
            startIcon={<Restaurant />}
            variant="outlined"
            sx={{ width: "100%" }}
          >
            Edit shared food list
          </Button>
        </Stack>
        <Button
          aria-label="Remove friend"
          startIcon={<Delete />}
          variant="outlined"
          onClick={handleRemoveFriend}
          sx={{
            width: "100%",
            mt: 5,
            backgroundColor: "#FFDAD6",
            color: "#B3261E",
            border: "#FFDAD6",
            "&:hover": {
              backgroundColor: "#FFB4AB",
              color: "#8C1D18",
            },
          }}
        >
          Remove friend
        </Button>
      </Box>
    </Box>
  );
}
