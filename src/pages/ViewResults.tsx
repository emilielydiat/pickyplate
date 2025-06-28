import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";
import { FoodCard } from "../components/FoodCard";
import { FoodEntry, Rating } from "../data/mockData";
import { useUserContext } from "../context/UserContext";
import { useMealSessionContext } from "../context/MealSessionContext";
import { Link } from "react-router-dom";

export function ViewResults() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("View results");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const { id } = useUserContext();
  const { mealSession } = useMealSessionContext();

  if (!mealSession) return <Typography>Loading...</Typography>;

  const isInitiator = mealSession.initiatorId === id;
  const ratings = {
    initiator: mealSession.initiatorRating as Rating,
    receiver: mealSession.receiverRating as Rating,
  };

  console.log("mealSession.initiatorRating", mealSession.initiatorRating);
  console.log("mealSession.receiverRating", mealSession.receiverRating);

  const foodOptions = [
    {
      key: "initiatorOption",
      foodEntry: mealSession.initiatorOption as FoodEntry,
      userRating: isInitiator
        ? ratings.initiator.initiatorOption
        : ratings.receiver.initiatorOption,
      friendRating: isInitiator
        ? ratings.receiver.initiatorOption
        : ratings.initiator.initiatorOption,
    },
    {
      key: "receiverOption",
      foodEntry: mealSession.receiverOption as FoodEntry,
      userRating: isInitiator
        ? ratings.initiator.receiverOption
        : ratings.receiver.receiverOption,
      friendRating: isInitiator
        ? ratings.receiver.receiverOption
        : ratings.initiator.receiverOption,
    },
  ].map((option) => ({
    ...option,
    averageRating: (option.userRating + option.friendRating) / 2,
  }));

  const maxAverage = Math.max(...foodOptions.map((opt) => opt.averageRating));

  const finalFoodOptions = foodOptions.map((option) => ({
    ...option,
    isWin: option.averageRating === maxAverage,
  }));

  const sortWinnersFirst = finalFoodOptions.sort((a, b) => {
    if (a.isWin === b.isWin) return 0;
    return a.isWin ? -1 : 1;
  });

  return (
    <Box component="section">
      <Stack spacing={5} sx={{ alignItems: "center" }}>
        {sortWinnersFirst.map(
          ({
            key,
            foodEntry,
            averageRating,
            userRating,
            friendRating,
            isWin,
          }) => (
            <Box
              key={key}
              sx={{ width: "100%", maxWidth: "360px", mx: "auto" }}
            >
              <FoodCard
                variant={isWin ? "ratedWon" : "ratedLost"}
                foodEntry={foodEntry}
                averageRating={averageRating}
                userRating={userRating}
                friendRating={friendRating}
              />
            </Box>
          )
        )}
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
        <Button
          component={Link}
          to="/requests"
          aria-label="Close and go back to requests page"
          variant="contained"
        >
          Done
        </Button>
      </Box>
    </Box>
  );
}
