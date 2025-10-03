import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { Mood, Restaurant, Delete } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { removeFriend, getUserById } from "../api/api";
import { AppDialog } from "../components/AppDialog";
import { usePageHeader } from "../hooks/usePageHeader";
import { constructAvatarURL } from "../utils/supabase";
import { User } from "../types";
import { useFriendsContext } from "../context/FriendsContext";

type DialogConfig = {
  titleText: string;
  contentText: string | React.ReactNode;
  primaryBtnLabel: string;
  secondaryBtnLabel: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
};

export function FriendProfile() {
  usePageHeader("Friend's profile", true);

  const { friendId } = useParams();
  const navigate = useNavigate();
  // const { id } = useUserContext();
  const { reload } = useFriendsContext();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [friend, setFriend] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const result = await getUserById(friendId!);
      if (!result) return;
      setFriend(result);
    })();
  }, [friendId]);

  const defaultDialogConfig: DialogConfig = {
    titleText: "",
    contentText: "",
    primaryBtnLabel: "",
    secondaryBtnLabel: "",
    onPrimaryAction: () => {},
    onSecondaryAction: () => {},
  };
  const [dialogConfig, setDialogConfig] =
    useState<DialogConfig>(defaultDialogConfig);

  // TO DO: loading
  if (!friend) {
    return (
      <Typography component="h2" variant="body1">
        Loading friend profile...
      </Typography>
    );
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleRemoveFriend = async () => {
    setDialogConfig({
      titleText: "Remove friend?",
      contentText: `This will permanently remove ${friend.name} from your friend list`,
      primaryBtnLabel: "Remove friend",
      secondaryBtnLabel: "Cancel",
      onPrimaryAction: async () => {
        setDialogOpen(false);
        try {
          await removeFriend(friend.id);
          await reload();
          setDialogOpen(false);
          navigate("/friends");
        } catch (error) {
          console.error("Failed to remove friend", error);
        }
      },
      onSecondaryAction: handleDialogClose,
    });
    setDialogOpen(true);
    return;
  };

  return (
    <Box
      component="section"
      aria-label={`Profile of ${friend.name}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 10,
      }}
    >
      <Avatar
        src={constructAvatarURL(friend.avatar)}
        alt={`Avatar of ${friend.name}`}
        sx={{ width: "112px", height: "112px", mb: 3 }}
      />
      <Typography component="h2" variant="h6Branded">
        {friend.name}
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
            to={`/eat-together/${friend.id}`}
            state={{ from: "friend-profile" }}
            aria-label={`Eat together with ${friend.name}`}
            startIcon={<Mood />}
            variant="outlined"
            type="button"
            sx={{ width: "100%" }}
          >
            Eat together
          </Button>
          <Button
            component={Link}
            to={`/friend/${friend.id}/shared-food-list`}
            aria-label={`Edit shared food list with ${friend.name}`}
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
      <AppDialog
        open={dialogOpen}
        withTextField={false}
        titleText={dialogConfig.titleText}
        contentText={dialogConfig.contentText}
        primaryBtnLabel={dialogConfig.primaryBtnLabel}
        secondaryBtnLabel={dialogConfig.secondaryBtnLabel}
        onClose={handleDialogClose}
        onSecondaryAction={dialogConfig.onSecondaryAction}
        onPrimaryAction={dialogConfig.onPrimaryAction}
      />
    </Box>
  );
}
