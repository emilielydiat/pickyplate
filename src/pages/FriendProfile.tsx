import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { Mood, Restaurant, Delete } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFriendData } from "../hooks/useFriendData";
import { getSharedFoodList, getMealSession, removeFriend } from "../api/api";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useUserContext } from "../context/UserContext";
import { useFriendsContext } from "../context/FriendsContext";
import { User } from "../data/mockData";
import { AppDialog } from "../components/AppDialog";

type DialogConfig = {
  titleText: string;
  contentText: string | React.ReactNode;
  confirmBtnLabel: string;
  cancelBtnLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function FriendProfile() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle(null);
  }, [setPageTitle]);

  const navigate = useNavigate();
  const { id } = useUserContext();
  const { friend } = useFriendData();
  const { updateFriends } = useFriendsContext();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const defaultDialogConfig: DialogConfig = {
    titleText: "",
    contentText: "",
    confirmBtnLabel: "",
    cancelBtnLabel: "",
    onConfirm: () => {},
    onCancel: () => {},
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

  const handleEatTogetherClick = async (friend: User) => {
    if (!id) return;

    const sharedFoodList = await getSharedFoodList(id, friend.id);

    if (sharedFoodList.length === 0) {
      setDialogConfig({
        titleText: "Oops, no shared food to pick from",
        contentText:
          "Your food list with this friend is empty! Add some food to explore your next meal together.",
        confirmBtnLabel: "Add food",
        cancelBtnLabel: "Close",
        onConfirm: () => {
          setDialogOpen(false);
          navigate(`/friend/${friend.id}/shared-food-list`);
        },
        onCancel: handleDialogClose,
      });
      setDialogOpen(true);
      return;
    }

    const mealSession = await getMealSession(id, friend.id);

    if (mealSession) {
      if (
        !(
          mealSession.status === "everyone_rated" ||
          mealSession.status === "cancelled" ||
          mealSession.status === "rejected"
        )
      ) {
        setDialogConfig({
          titleText: "You’re already deciding what to eat together!",
          contentText: (
            <>
              Find your current session in the “Decide what to eat together”
              section in your Requests menu. <br /> <br /> Want to start fresh
              instead? Begin a new session if you’d like.
            </>
          ),
          confirmBtnLabel: "Go to current",
          cancelBtnLabel: "New session",
          onConfirm: () => {
            setDialogOpen(false);
            navigate("/requests");
          },
          onCancel: async () => {
            setDialogOpen(false);
            navigate(`/eat-together/${friend.id}/meal-preferences`);
          },
        });
        setDialogOpen(true);
        return;
      }
    }

    navigate(`/eat-together/${friend.id}/meal-preferences`);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleRemoveFriend = async () => {
    setDialogConfig({
      titleText: "Remove friend?",
      contentText: `This will permanently remove ${friend.username} from your friend list`,
      confirmBtnLabel: "Remove friend",
      cancelBtnLabel: "Cancel",
      onConfirm: async () => {
        setDialogOpen(false);
        try {
          await removeFriend(id, friend.id);
          await updateFriends();
          navigate("/friends");
        } catch (error) {
          console.error("Failed to remove friend", error);
        }
      },
      onCancel: handleDialogClose,
    });
    setDialogOpen(true);
    return;
  };

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
            aria-label={`Eat together with ${friend.username}`}
            startIcon={<Mood />}
            variant="outlined"
            type="button"
            onClick={() => handleEatTogetherClick(friend)}
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
      <AppDialog
        open={dialogOpen}
        withTextField={false}
        titleText={dialogConfig.titleText}
        contentText={dialogConfig.contentText}
        confirmBtnLabel={dialogConfig.confirmBtnLabel}
        cancelBtnLabel={dialogConfig.cancelBtnLabel}
        onClose={handleDialogClose}
        onCancel={dialogConfig.onCancel}
        onConfirm={dialogConfig.onConfirm}
      />
    </Box>
  );
}
