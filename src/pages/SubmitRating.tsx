import { Box, Button, Stack, Typography } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { AppDialog } from "../components/AppDialog";
import { usePageHeader } from "../hooks/usePageHeader";
import { EatTogetherContext } from "../context/EatTogetherContext";
import { FoodCard } from "../components/FoodCard";
import {
  determineIfUserIsInitiator,
  getMealSessionStage,
} from "../utils/mealSession";
import { submitMealSessionRating } from "../api/api";
import { MealSessionStage } from "../types";
import { useDialogManager } from "../hooks/useDialogManager";

export function SubmitRating() {
  usePageHeader("Submit rating", true);

  const navigate = useNavigate();
  const { friendId } = useParams();
  const { id } = useUserContext();
  const { friend, sharedFoodList, session, reloadSession } =
    useContext(EatTogetherContext)!;
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const { dialogOpen, dialogConfig, openDialog, closeDialog } =
    useDialogManager();

  const isUserInitiator = determineIfUserIsInitiator(id, session!);

  const userPick = useMemo(() => {
    const foodId = isUserInitiator ? session!.food_1 : session!.food_2;
    return sharedFoodList.find((food) => food.id === foodId)!;
  }, [isUserInitiator, sharedFoodList, session]);

  const friendPick = useMemo(() => {
    const foodId = isUserInitiator ? session!.food_2 : session!.food_1;
    return sharedFoodList.find((food) => food.id === foodId)!;
  }, [isUserInitiator, sharedFoodList, session]);

  const isSubmitDisabled = rating1 === 0 || rating2 === 0;

  const handleSubmit = async () => {
    const updatedSession = await submitMealSessionRating(
      friendId!,
      rating1,
      rating2
    );
    const sessionStatus = getMealSessionStage(id, updatedSession);

    if (sessionStatus === MealSessionStage.AwaitingRatingFromFriend) {
      openDialog({
        withTextField: false,
        titleText: "Ratings submitted",
        contentText:
          "We're now waiting for your friend to submit theirs.\n\nCheck the “Decide what to eat together” section in your Requests menu for updates.",
        primaryBtnLabel: "Done",
        onPrimaryAction: () => {
          closeDialog();
          navigate("/requests");
        },
      });
    } else {
      void reloadSession();
    }
  };

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
            ratingValue={isUserInitiator ? rating1 : rating2}
            onRatingChange={isUserInitiator ? setRating1 : setRating2}
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
            ratingValue={isUserInitiator ? rating2 : rating1}
            onRatingChange={isUserInitiator ? setRating2 : setRating1}
          />
        </Box>
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
        <Button
          aria-label={`Submit ratings of meal options to eat with ${friend.name}`}
          variant="contained"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          Submit rating
        </Button>
      </Box>
      <AppDialog
        open={dialogOpen}
        titleText={dialogConfig.titleText}
        contentText={dialogConfig.contentText}
        onClose={closeDialog}
        primaryBtnLabel={dialogConfig.primaryBtnLabel}
        onPrimaryAction={dialogConfig.onPrimaryAction}
      />
    </Box>
  );
}
