import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { MealSession, Rating } from "../data/mockData";
import { useFriend } from "./MealRatingFlowWrapper";
import { useUserContext } from "../context/UserContext";
import { useMealSessionContext } from "../context/MealSessionContext";
import { updateMealSession } from "../api/api";
import { useNavigate } from "react-router-dom";
import { AppDialog } from "../components/AppDialog";
import { usePageHeader } from "../hooks/usePageHeader";

export function SubmitRating() {
  usePageHeader("Submit rating", true);

  const navigate = useNavigate();
  const { id } = useUserContext();
  const { friend } = useFriend();
  const { mealSession, setMealSession } = useMealSessionContext();
  const [ratingValue] = useState<
    Partial<{
      initiatorRating?: Partial<Rating>;
      receiverRating?: Partial<Rating>;
    }>
  >({});
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  if (!mealSession) return <Typography>Loading...</Typography>;

  const isInitiator = mealSession.initiatorId === id;
  const sessionStatus = mealSession.status;
  // const userPick = isInitiator
  //   ? (mealSession.initiatorOption as FoodEntry)
  //   : (mealSession.receiverOption as FoodEntry);
  // const friendPick = isInitiator
  //   ? (mealSession.receiverOption as FoodEntry)
  //   : (mealSession.initiatorOption as FoodEntry);

  const currentRating = isInitiator
    ? ratingValue.initiatorRating
    : ratingValue.receiverRating;

  // function handleRatingChange(
  //   value: number,
  //   optionKey: "initiatorOption" | "receiverOption",
  // ) {
  //   setRatingValue((prev) => {
  //     const updated = isInitiator
  //       ? {
  //           ...prev,
  //           initiatorRating: {
  //             ...prev.initiatorRating,
  //             [optionKey]: value,
  //           },
  //         }
  //       : {
  //           ...prev,
  //           receiverRating: {
  //             ...prev.receiverRating,
  //             [optionKey]: value,
  //           },
  //         };
  //     return updated;
  //   });
  // }

  // HERE: add dialog -> only show if status === "everyone_preferences_set"
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
      updates,
    );
    setMealSession((prev) => ({
      ...prev!,
      ...updates,
    }));

    if (
      updates.status === "initiator_rated" ||
      updates.status === "receiver_rated"
    ) {
      setDialogOpen(true);
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
          {/*<FoodCard*/}
          {/*  variant="unrated"*/}
          {/*  foodEntry={userPick}*/}
          {/*  ratingValue={currentRating?.initiatorOption}*/}
          {/*  onRatingChange={(value) =>*/}
          {/*    handleRatingChange(value, "initiatorOption")*/}
          {/*  }*/}
          {/*/>*/}
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
          {/*<FoodCard*/}
          {/*  variant="unrated"*/}
          {/*  foodEntry={friendPick}*/}
          {/*  ratingValue={currentRating?.receiverOption}*/}
          {/*  onRatingChange={(value) =>*/}
          {/*    handleRatingChange(value, "receiverOption")*/}
          {/*  }*/}
          {/*/>*/}
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
      <AppDialog
        open={dialogOpen}
        withTextField={false}
        titleText="Ratings submitted"
        contentText={
          <>
            Your ratings are in! We’re now waiting for your friend to submit
            theirs.
            <br /> <br />
            Check the “Decide what to eat together” section in your Requests
            menu for updates.
          </>
        }
        primaryBtnLabel="Done"
        onClose={() => setDialogOpen(false)}
        onPrimaryAction={() => {
          setDialogOpen(false);
          navigate("/requests");
        }}
      />
    </Box>
  );
}
