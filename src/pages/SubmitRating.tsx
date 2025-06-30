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
  const initiatorOption = mealSession.initiatorOption as FoodEntry;
  const receiverOption = mealSession.receiverOption as FoodEntry;

  function handleRatingChange(
    value: number,
    optionKey: "initiatorOption" | "receiverOption"
  ) {
    setRatingValue((prev) => {
      if (isInitiator) {
        return {
          ...prev,
          initiatorRating: {
            ...prev.initiatorRating,
            [optionKey]: value,
          },
        };
      } else {
        return {
          ...prev,
          receiverRating: {
            ...prev.receiverRating,
            [optionKey]: value,
          },
        };
      }
    });
    console.log("ratingValueOnHandleRatingChange: ", ratingValue);
  }

  const handleSubmit = async () => {
    if (!mealSession) return;
    const updates: Partial<MealSession> = {};

    if (sessionStatus === "everyone_preferences_set" && isInitiator) {
      const ir = ratingValue.initiatorRating;

      if (
        ir?.initiatorOption !== undefined &&
        ir?.receiverOption !== undefined
      ) {
        updates.initiatorRating = {
          initiatorOption: ir.initiatorOption,
          receiverOption: ir.receiverOption,
        };
      }
      updates.status = "initiator_rated";
    }

    if (sessionStatus === "everyone_preferences_set" && !isInitiator) {
      const rr = ratingValue.receiverRating;

      if (
        rr?.initiatorOption !== undefined &&
        rr?.receiverOption !== undefined
      ) {
        updates.receiverRating = {
          initiatorOption: rr.initiatorOption,
          receiverOption: rr.receiverOption,
        };
      }
      updates.status = "receiver_rated";
    }

    if (sessionStatus === "initiator_rated" && !isInitiator) {
      const rr = ratingValue.receiverRating;

      if (
        rr?.initiatorOption !== undefined &&
        rr?.receiverOption !== undefined
      ) {
        updates.receiverRating = {
          initiatorOption: rr.initiatorOption,
          receiverOption: rr.receiverOption,
        };
      }
      updates.status = "everyone_rated";
    }

    if (sessionStatus === "receiver_rated" && isInitiator) {
      const ir = ratingValue.initiatorRating;

      if (
        ir?.initiatorOption !== undefined &&
        ir?.receiverOption !== undefined
      ) {
        updates.initiatorRating = {
          initiatorOption: ir.initiatorOption,
          receiverOption: ir.receiverOption,
        };
      }
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
    console.log("mealSessionOnSubmit: ", mealSession);

    if (
      updates.status === "initiator_rated" ||
      updates.status === "receiver_rated"
    ) {
      navigate("/requests");
    } else if (updates.status === "everyone_rated") {
      navigate(`/eat-together/${friend.id}/view-results`);
    }
  };

  const isSubmitDisabled = isInitiator
    ? ratingValue.initiatorRating?.initiatorOption === undefined ||
      ratingValue.initiatorRating?.initiatorOption === 0 ||
      ratingValue.initiatorRating?.receiverOption === undefined ||
      ratingValue.initiatorRating?.receiverOption === 0
    : ratingValue.receiverRating?.initiatorOption === undefined ||
      ratingValue.receiverRating?.initiatorOption === 0 ||
      ratingValue.receiverRating?.receiverOption === undefined ||
      ratingValue.receiverRating?.receiverOption === 0;

  console.log("ratingValueOnLoad: ", ratingValue);

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
            {isInitiator ? "Your pick" : "Friend's pick"}
          </Typography>
          <FoodCard
            variant="unrated"
            foodEntry={initiatorOption}
            ratingValue={
              isInitiator
                ? ratingValue.initiatorRating?.initiatorOption
                : ratingValue.receiverRating?.initiatorOption
            }
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
            {isInitiator ? "Friend's pick" : "Your pick"}
          </Typography>
          <FoodCard
            variant="unrated"
            foodEntry={receiverOption}
            ratingValue={
              isInitiator
                ? ratingValue.initiatorRating?.receiverOption
                : ratingValue.receiverRating?.receiverOption
            }
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
          Submit ratings
        </Button>
      </Box>
    </Box>
  );
}
