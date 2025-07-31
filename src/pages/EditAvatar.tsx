import { Avatar, Box, Button, Grid2, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
// import { useUserContext } from "../context/UserContext";
import { avatarOptions } from "../data/mockData";
import { usePageHeader } from "../hooks/usePageHeader";

// This component will be updated to integrate Supabase in the next iteration
export function EditAvatar() {
  usePageHeader("Choose your avatar", true);

  // const { user } = useUserContext();
  const [selectedAvatar, setSelectedAvatar] = useState("");

  function handleAvatarSelection(avatar: string) {
    setSelectedAvatar(avatar);
  }

  function handleAvatarConfirm() {
    // if (user.avatar !== selectedAvatar) {
    //   user.setAvatar(selectedAvatar);
    // }

    return;
  }

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Grid2 container justifyContent="center" spacing={2}>
        {avatarOptions.map((avatarOption, index) => (
          <Avatar
            component="button"
            type="button"
            key={index}
            src={avatarOption}
            aria-label={`Avatar image option ${index + 1}`}
            onClick={() => handleAvatarSelection(avatarOption)}
            sx={{
              all: "unset",
              height: 80,
              width: 80,
              color: "primary.main",
              border: selectedAvatar === avatarOption ? "4px solid" : "none",
              borderRadius: "50%",
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
              "&:focus": {
                outline: "3px solid",
                outlineColor: "#3139FBFF",
              },
            }}
          />
        ))}
      </Grid2>
      <Stack sx={{ mt: 8, mr: 2, alignItems: "flex-end" }}>
        <Button
          component={Link}
          to="/profile"
          aria-label="Confirm avatar selection"
          variant="contained"
          onClick={handleAvatarConfirm}
        >
          Confirm
        </Button>
      </Stack>
    </Box>
  );
}
