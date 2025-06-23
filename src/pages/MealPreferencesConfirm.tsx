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
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";
import { capitaliseWord } from "../utils/stringUtils";
import { useMealPreferencesDraftContext } from "../context/MealPreferencesDraftContext";
import { useFriend } from "./MealPreferencesFlowWrapper";
import {
  getMealSession,
  updateMealSession,
  getSharedFoodList,
} from "../api/api";
import { useUserContext } from "../context/UserContext";
import { MealPreferencesData } from "../data/mockData";
import { useNavigate } from "react-router-dom";
import { matchFoodToPreferences } from "../utils/foodOptionUtils";

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

  if (!draft) return <Typography>Loading...</Typography>;

  console.log("draft: ", draft);

  async function handleConfirm() {
    const sessionWithFriend = await getMealSession(id, friend.id);
    const sharedFoodList = await getSharedFoodList(id, friend.id);

    if (sessionWithFriend) {
      if (sessionWithFriend.status === "accepted") {
        const foodOption = matchFoodToPreferences(
          sharedFoodList,
          draft as MealPreferencesData
        );

        await updateMealSession(friend.id, id, {
          receiverPreferences: draft as MealPreferencesData,
          status: "everyone_preferences_set",
          receiverOption: foodOption,
        });

        navigate(`/eat-together/${friend.id}/submit-rating`);
      } else {
        const foodOption = matchFoodToPreferences(
          sharedFoodList,
          draft as MealPreferencesData
        );
        await updateMealSession(id, friend.id, {
          initiatorPreferences: draft as MealPreferencesData,
          status: "invited",
          initiatorOption: foodOption,
        });
        navigate("/requests");
      }
    } else {
      const foodOption = matchFoodToPreferences(
        sharedFoodList,
        draft as MealPreferencesData
      );
      await updateMealSession(id, friend.id, {
        initiatorPreferences: draft as MealPreferencesData,
        status: "invited",
        initiatorOption: foodOption,
      });
      navigate("/requests");
    }
  }

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
          onClick={() => handleConfirm()}
          sx={{ mb: 2 }}
        >
          Confirm and send
        </Button>
      </Box>
    </Box>
  );
}
