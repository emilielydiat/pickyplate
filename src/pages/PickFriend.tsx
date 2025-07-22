import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../data/mockData";
import { AppDialog } from "../components/AppDialog";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useFriendsContext } from "../context/FriendsContext";
import { useUserContext } from "../context/UserContext";
import { getSharedFoodList, getMealSession } from "../api/api";

type DialogConfig = {
  titleText: string;
  contentText: string | React.ReactNode;
  confirmBtnLabel: string;
  cancelBtnLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function PickFriend() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Pick a friend");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const navigate = useNavigate();
  const { id } = useUserContext();
  const { friends } = useFriendsContext();
  const [searchInput, setSearchInput] = useState<string>("");
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

  const filteredFriends: User[] = useMemo(() => {
    const input = searchInput.toLowerCase();
    if (input) {
      return friends.filter((friend) =>
        friend.username.toLowerCase().includes(input)
      );
    } else {
      return [];
    }
  }, [searchInput, friends]);

  const handleEatTogetherClick = async (friend: User) => {
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

  return (
    <Box component="section">
      <Stack spacing={2}>
        <TextField
          label="Search friend"
          variant="outlined"
          type="search"
          fullWidth
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        {!searchInput.trim() && (
          <Typography component="p" variant="body1">
            Start typing your friend's username
          </Typography>
        )}

        {filteredFriends.length === 0 && searchInput.trim() && (
          <Typography component="p" variant="body1">
            No friends found.
            <br /> Try a different spelling or invite them to join!
          </Typography>
        )}

        {filteredFriends.length !== 0 && (
          <List>
            {filteredFriends.map((friend) => (
              <ListItem
                key={friend.id}
                sx={{ px: 0, textDecoration: "none", color: "inherit" }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={friend.avatar}
                    alt={`Avatar of ${friend.username}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={friend.username}
                  sx={{ pr: 2, wordBreak: "break-word" }}
                />
                <Button
                  aria-label={`Eat together with ${friend.username}`}
                  variant="contained"
                  type="button"
                  onClick={() => handleEatTogetherClick(friend)}
                  sx={{ cursor: "pointer" }}
                >
                  Eat together
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Stack>

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
