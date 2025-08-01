import { Avatar, Box, Button, Grid2, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { usePageHeader } from "../hooks/usePageHeader";
import { FileObject } from "@supabase/storage-js/dist/module/lib/types";
import { getAvailableAvatars, updateUserProfile } from "../api/api";
import { constructAvatarURL } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export function EditAvatar() {
  usePageHeader("Choose your avatar", true);

  const { user, reload: reloadUser } = useUserContext();
  const navigate = useNavigate();

  const [selectedAvatar, setSelectedAvatar] = useState(user!.avatar);
  const [avatarOptions, setAvatarOptions] = useState<FileObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsUpdating(true);
      await updateUserProfile(user!.id, { avatar: selectedAvatar });
      await reloadUser();
      navigate("/profile");
    } catch (e) {
      console.error(`Failed to update user profile: ${e}`);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const result = await getAvailableAvatars();
        setAvatarOptions(result);
      } catch (e) {
        console.error("Failed to fetch avatar options", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return "Loading...";

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
        {avatarOptions.map((option, index) => (
          <Avatar
            component="button"
            type="button"
            key={index}
            src={constructAvatarURL(option.name)}
            aria-label={`Avatar image option ${index + 1}`}
            onClick={() => !isUpdating && setSelectedAvatar(option.name)}
            sx={{
              all: "unset",
              height: 80,
              width: 80,
              color: "primary.main",
              border: selectedAvatar === option.name ? "4px solid" : "none",
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
          aria-label="Confirm avatar selection"
          variant="contained"
          onClick={handleConfirm}
          disabled={isUpdating}
        >
          Confirm
        </Button>
      </Stack>
    </Box>
  );
}
