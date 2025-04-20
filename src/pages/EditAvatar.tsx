import { Avatar, Box, Button, Grid2, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useUserContext } from "../context/UserContext";
import { avatarOptions } from "../data/mockData";

export function EditAvatar() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Choose your avatar");
  });

  const user = useUserContext();
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user.avatar);

  function handleAvatarSelection(avatar: string) {
    setSelectedAvatar(avatar);
  }

  function handleAvatarConfirm() {
    if (user.avatar !== selectedAvatar) {
      user.setAvatar(selectedAvatar);
    }

    return;
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Grid2 container justifyContent="center" spacing={2}>
        {avatarOptions.map((avatarOption, index) => (
          <Avatar
            key={index}
            src={avatarOption}
            alt={"avatar image ${index}"}
            sx={{
              height: 80,
              width: 80,
              color: "primary.main",
              border: selectedAvatar
                ? selectedAvatar === avatarOption
                  ? "4px solid"
                  : "none"
                : user.avatar === avatarOption
                  ? "4px solid"
                  : "none",
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
            }}
            onClick={() => handleAvatarSelection(avatarOption)}
          />
        ))}
      </Grid2>
      <Stack sx={{ mt: 8, mr: 2, alignItems: "flex-end" }}>
        <Button
          component={Link}
          to="/profile"
          variant="contained"
          onClick={handleAvatarConfirm}
        >
          Confirm
        </Button>
      </Stack>
    </Box>
  );
}
