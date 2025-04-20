import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { Mood, Restaurant, Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useFriendData } from "../hooks/useFriendData";
import { removeFriend } from "../api/api";
import { usePageTitleContext } from "../context/PageTitleContext";

export function FriendProfile() {
  const { friend } = useFriendData();
  const { setPageTitle } = usePageTitleContext();

  useEffect(() => {
    setPageTitle(null);
  }, [setPageTitle]);

  if (!friend) {
    return <Typography>Loading friend profile...</Typography>;
  }

  function handleRemoveFriend() {
    // TO DO
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 10,
      }}
    >
      <Avatar
        src={friend.avatar}
        alt={friend.username}
        sx={{ width: "112px", height: "112px", mb: 3 }}
      />
      <Typography variant="h6Branded">{friend.username}</Typography>
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
            to={`/friend/${friend.id}/meal-preferences`}
            variant="outlined"
            startIcon={<Mood />}
            sx={{ width: "100%" }}
          >
            Eat together
          </Button>
          <Button
            component={Link}
            to={`/friend/${friend.id}/shared-food-list`}
            variant="outlined"
            startIcon={<Restaurant />}
            sx={{ width: "100%" }}
          >
            Edit shared food list
          </Button>
        </Stack>
        <Button
          onClick={handleRemoveFriend}
          variant="outlined"
          startIcon={<Delete />}
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
