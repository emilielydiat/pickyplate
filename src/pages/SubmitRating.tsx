import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";
import { FoodCard } from "../components/FoodCard";
import { FoodEntry, MealSession, Rating } from "../data/mockData";
import { useFriend } from "./MealRatingFlowWrapper";
import { useUserContext } from "../context/UserContext";
import { useMealSessionContext } from "../context/MealSessionContext";
import { updateMealSession } from "../api/api";
import { useNavigate } from "react-router-dom";

export function SubmitRating() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Submit rating");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const navigate = useNavigate();
  const { id } = useUserContext();
  const { friend } = useFriend();
  const { mealSession, setMealSession } = useMealSessionContext();
  const [ratingValue, setRatingValue] = useState<
    Partial<{
      initiatorRating?: Partial<Rating>;
      receiverRating?: Partial<Rating>;
    }>
  >({});

  if (!mealSession) return <Typography>Loading...</Typography>;

  const isInitiator = mealSession.initiatorId === id;
  const sessionStatus = mealSession.status;
  const userPick = isInitiator
    ? (mealSession.initiatorOption as FoodEntry)
    : (mealSession.receiverOption as FoodEntry);
  const friendPick = isInitiator
    ? (mealSession.receiverOption as FoodEntry)
    : (mealSession.initiatorOption as FoodEntry);

  const currentRating = isInitiator
    ? ratingValue.initiatorRating
    : ratingValue.receiverRating;

  function handleRatingChange(
    value: number,
    optionKey: "initiatorOption" | "receiverOption"
  ) {
    setRatingValue((prev) => {
      const updated = isInitiator
        ? {
            ...prev,
            initiatorRating: {
              ...prev.initiatorRating,
              [optionKey]: value,
            },
          }
        : {
            ...prev,
            receiverRating: {
              ...prev.receiverRating,
              [optionKey]: value,
            },
          };
      return updated;
    });
  }

  const handleSubmit = async () => {
    if (!mealSession) return;
    const updates: Partial<MealSession> = {};

    if (
      currentRating?.initiatorOption !== undefined &&
      currentRating?.receiverOption !== undefined
    ) {
      if (isInitiator) {
        updates.initiatorRating = {
          initiatorOption: currentRating.initiatorOption,
          receiverOption: currentRating.receiverOption,
        };
      } else {
        updates.receiverRating = {
          initiatorOption: currentRating.initiatorOption,
          receiverOption: currentRating.receiverOption,
        };
      }
    }

    if (sessionStatus === "everyone_preferences_set") {
      updates.status = isInitiator ? "initiator_rated" : "receiver_rated";
    } else if (
      (sessionStatus === "initiator_rated" && !isInitiator) ||
      (sessionStatus === "receiver_rated" && isInitiator)
    ) {
      updates.status = "everyone_rated";
    }

    await updateMealSession(
      mealSession.initiatorId,
      mealSession.receiverId,
      updates
    );
    setMealSession((prev) => ({
      ...prev!,
      ...updates,
    }));

    if (
      updates.status === "initiator_rated" ||
      updates.status === "receiver_rated"
    ) {
      navigate("/requests");
    } else if (updates.status === "everyone_rated") {
      navigate(`/eat-together/${friend.id}/view-results`);
    }
  };

  const isSubmitDisabled =
    currentRating?.initiatorOption === undefined ||
    currentRating?.initiatorOption === 0 ||
    currentRating?.receiverOption === undefined ||
    currentRating?.receiverOption === 0;

  return (
    <Box component="section">
      <Stack spacing={5} sx={{ alignItems: "center" }}>
        <Box sx={{ width: "100%", maxWidth: "360px", mx: "auto" }}>
          <Typography
            component="h2"
            variant="h6Branded"
            textAlign="left"
            mb="16px"
          >
            Your pick
          </Typography>
          <FoodCard
            variant="unrated"
            foodEntry={userPick}
            ratingValue={currentRating?.initiatorOption}
            onRatingChange={(value) =>
              handleRatingChange(value, "initiatorOption")
            }
          />
        </Box>
        <Box sx={{ width: "100%", maxWidth: "360px", mx: "auto" }}>
          <Typography
            component="h2"
            variant="h6Branded"
            textAlign="left"
            mb="16px"
          >
            Friend's pick
          </Typography>
          <FoodCard
            variant="unrated"
            foodEntry={friendPick}
            ratingValue={currentRating?.receiverOption}
            onRatingChange={(value) =>
              handleRatingChange(value, "receiverOption")
            }
          />
        </Box>
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
        <Button
          aria-label={`Submit ratings of meal options to eat with ${friend.username}`}
          variant="contained"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          Submit rating
        </Button>
      </Box>
    </Box>
  );
}
