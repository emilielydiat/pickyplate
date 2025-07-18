import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import {
  DiningOutlined,
  PlaceOutlined,
  AccountBalanceWalletOutlined,
  AccessTime,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";
import { capitaliseWord } from "../utils/stringUtils";
import { useMealPreferencesDraftContext } from "../context/MealPreferencesDraftContext";
import { useFriend } from "./MealPreferencesFlowWrapper";
import {
  getMealSession,
  updateMealSession,
  getSharedFoodList,
  resetMealSession,
} from "../api/api";
import { useUserContext } from "../context/UserContext";
import { MealPreferencesData } from "../data/mockData";
import { useNavigate } from "react-router-dom";
import { matchFoodToPreferences } from "../utils/foodOptionUtils";
import { AppDialog } from "../components/AppDialog";

type DialogConfig = {
  titleText: string;
  contentText: string | React.ReactNode;
  confirmBtnLabel: string;
  onConfirm: () => void;
};

export function MealPreferencesConfirm() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Confirm and send");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const { draft } = useMealPreferencesDraftContext();
  const friendData = useFriend();
  const friend = friendData?.friend;
  const { id } = useUserContext();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const defaultDialogConfig: DialogConfig = {
    titleText: "",
    contentText: "",
    confirmBtnLabel: "",
    onConfirm: () => {},
  };
  const [dialogConfig, setDialogConfig] =
    useState<DialogConfig>(defaultDialogConfig);

  function getOopsDialogConfig(onNavigate: () => void): DialogConfig {
    return {
      titleText: "Oops! No matching food found",
      contentText: (
        <>
          No food matches your preferences in the shared list with this friend.
          <br /> <br />
          Change your meal preferences and try again.
        </>
      ),
      confirmBtnLabel: "Change meal preferences",
      onConfirm: () => {
        setDialogOpen(false);
        onNavigate();
      },
    };
  }

  function getInvitedDialogConfig(onNavigate: () => void): DialogConfig {
    return {
      titleText: "Meal invitation sent",
      contentText: (
        <>
          Your friend will receive the invite to eat together. <br />
          <br /> Check the “Decide what to eat together” section in your
          Requests menu for updates.
        </>
      ),
      confirmBtnLabel: "Go to requests menu",
      onConfirm: () => {
        setDialogOpen(false);
        onNavigate();
      },
    };
  }

  if (!draft) return <Typography>Loading...</Typography>;

  async function handleSubmitPreferences() {
    const sessionWithFriend = await getMealSession(id, friend.id);
    const sharedFoodList = await getSharedFoodList(id, friend.id);

    const foodOption = matchFoodToPreferences(
      sharedFoodList,
      draft as MealPreferencesData
    );

    if (!foodOption) {
      setDialogConfig(getOopsDialogConfig(() => navigate(-1)));
      setDialogOpen(true);
      return;
    }

    if (!sessionWithFriend) {
      setDialogConfig(getInvitedDialogConfig(() => navigate("/requests")));
      setDialogOpen(true);
      await updateMealSession(id, friend.id, {
        initiatorPreferences: draft as MealPreferencesData,
        status: "invited",
        initiatorId: id,
        receiverId: friend.id,
        initiatorOption: foodOption,
      });
      return;
    }

    if (sessionWithFriend.status === "accepted") {
      await updateMealSession(friend.id, id, {
        receiverPreferences: draft as MealPreferencesData,
        status: "everyone_preferences_set",
        receiverOption: foodOption,
      });

      navigate(`/eat-together/${friend.id}/submit-rating`);
      return;
    }

    setDialogConfig(getInvitedDialogConfig(() => navigate("/requests")));
    setDialogOpen(true);
    await resetMealSession(id, friend.id);
    await updateMealSession(id, friend.id, {
      initiatorPreferences: draft as MealPreferencesData,
      status: "invited",
      initiatorId: id,
      receiverId: friend.id,
      initiatorOption: foodOption,
    });
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "calc(100vh - 176px)",
      }}
    >
      <Card sx={{ width: { xs: "100%", sm: 360 } }}>
        <CardContent
          sx={{
            p: 2,
            "&:last-child": {
              pb: 2,
            },
          }}
        >
          <Stack sx={{ flexDirection: "column", alignItems: "flex-start" }}>
            <Typography component="h3" variant="h6Branded">
              Your meal preferences
            </Typography>
            {draft.type && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
                <DiningOutlined
                  aria-hidden="true"
                  focusable="false"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="grey.700">
                  {capitaliseWord(draft.type)}
                </Typography>
              </Box>
            )}

            {draft.location && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PlaceOutlined
                  aria-hidden="true"
                  focusable="false"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="grey.700">
                  {draft.location.map(capitaliseWord).join(" | ")}
                </Typography>
              </Box>
            )}

            {draft.price && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccountBalanceWalletOutlined
                  aria-hidden="true"
                  focusable="false"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="grey.700">
                  {draft.price.label} per person
                </Typography>
              </Box>
            )}

            {draft.maxTime && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccessTime
                  aria-hidden="true"
                  focusable="false"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="grey.700">
                  {capitaliseWord(draft.maxTime)}
                </Typography>
              </Box>
            )}

            {draft.cuisine && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "left",
                  gap: 1,
                }}
              >
                {draft.cuisine.map((cuisine) => (
                  <Chip key={cuisine} label={capitaliseWord(cuisine)} />
                ))}
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Box width="100%" display="flex" justifyContent="flex-end">
        <Button
          aria-label={`Confirm your meal preferences for meal with ${friend.username}`}
          variant="contained"
          color="primary"
          onClick={() => handleSubmitPreferences()}
          sx={{ mb: 2 }}
        >
          Confirm and send
        </Button>
      </Box>
      <AppDialog
        open={dialogOpen}
        withTextField={false}
        titleText={dialogConfig.titleText}
        contentText={dialogConfig.contentText}
        confirmBtnLabel={dialogConfig.confirmBtnLabel}
        onClose={handleDialogClose}
        onConfirm={dialogConfig.onConfirm}
      />
    </Box>
  );
}
