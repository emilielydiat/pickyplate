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
import { Add } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { emptyStateImages } from "../data/mockData";
import { AppDialog } from "../components/AppDialog";
import { useFriendsContext } from "../context/FriendsContext";
import { useUserContext } from "../context/UserContext";
import { getSharedFoodList, getMealSession } from "../api/api";
import { usePageHeader } from "../hooks/usePageHeader";
import { EmptyState } from "../components/EmptyState";
import { constructAvatarURL } from "../utils/supabase";
import { User } from "../types";

type DialogConfig = {
  titleText: string;
  contentText: string | React.ReactNode;
  primaryBtnLabel: string;
  secondaryBtnLabel: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
};

export function PickFriend() {
  usePageHeader("Pick a friend", true);

  const navigate = useNavigate();
  const { id } = useUserContext();
  const { friends } = useFriendsContext();
  const [searchInput, setSearchInput] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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

  const filteredFriends: User[] = useMemo(() => {
    const input = searchInput.toLowerCase();
    if (input) {
      return friends.filter((friend) =>
        friend.name.toLowerCase().includes(input),
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
        primaryBtnLabel: "Add food",
        secondaryBtnLabel: "Close",
        onPrimaryAction: () => {
          setDialogOpen(false);
          navigate(`/friend/${friend.id}/shared-food-list`);
        },
        onSecondaryAction: handleDialogClose,
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
          primaryBtnLabel: "Go to current",
          secondaryBtnLabel: "New session",
          onPrimaryAction: () => {
            setDialogOpen(false);
            navigate("/requests");
          },
          onSecondaryAction: async () => {
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
          <EmptyState
            image={emptyStateImages.pickAFriend}
            heading="Can't find that friend"
            textContent="Try another name or add them to your friend list!"
            button={
              <Button
                startIcon={<Add />}
                variant="contained"
                onClick={() => navigate("/friends/add-friend")}
              >
                Add friend
              </Button>
            }
          />
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
                    src={constructAvatarURL(friend.avatar)}
                    alt={`Avatar of ${friend.name}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={friend.name}
                  sx={{ pr: 2, wordBreak: "break-word" }}
                />
                <Button
                  aria-label={`Eat together with ${friend.name}`}
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
        primaryBtnLabel={dialogConfig.primaryBtnLabel}
        secondaryBtnLabel={dialogConfig.secondaryBtnLabel}
        onClose={handleDialogClose}
        onSecondaryAction={dialogConfig.onSecondaryAction}
        onPrimaryAction={dialogConfig.onPrimaryAction}
      />
    </Box>
  );
}
