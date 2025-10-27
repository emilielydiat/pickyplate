import { Box, Button, Stack } from "@mui/material";
import { useUserContext } from "../context/UserContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePageHeader } from "../hooks/usePageHeader";
import { useContext, useMemo } from "react";
import { EatTogetherContext } from "../context/EatTogetherContext";
import { FoodCard } from "../components/FoodCard";
import { determineIfUserIsInitiator } from "../utils/mealSession";
import { deleteMealSession } from "../api/api";

export function ViewResults() {
  usePageHeader("View results", true);

  const { id } = useUserContext();
  const { friendId } = useParams();
  const navigate = useNavigate();
  const { sharedFoodList, session } = useContext(EatTogetherContext)!;

  const isUserInitiator = determineIfUserIsInitiator(id, session!);

  const food1 = useMemo(() => {
    return sharedFoodList.find((food) => food.id === session!.food_1)!;
  }, [sharedFoodList, session]);

  const food2 = useMemo(() => {
    return sharedFoodList.find((food) => food.id === session!.food_2)!;
  }, [sharedFoodList, session]);

  const food1Rating = useMemo(() => {
    return (session!.rating_1_food_1! + session!.rating_2_food_1!) / 2;
  }, [session]);

  const food2Rating = useMemo(() => {
    return (session!.rating_1_food_2! + session!.rating_2_food_2!) / 2;
  }, [session]);

  const isAutoWon = useMemo(
    () => session!.food_1 === session!.food_2,
    [session]
  );

  const isTie = useMemo(() => {
    return food1Rating === food2Rating;
  }, [food1Rating, food2Rating]);

  const rankedFoods = useMemo(() => {
    if (isTie) return [food1, food2];

    return [
      food1Rating > food2Rating ? food1 : food2,
      food1Rating > food2Rating ? food2 : food1,
    ];
  }, [food1Rating, food2Rating, food1, food2, isTie]);

  const food1UserRating = useMemo(() => {
    return isUserInitiator
      ? session!.rating_1_food_1!
      : session!.rating_2_food_1!;
  }, [isUserInitiator, session]);

  const food1FriendRating = useMemo(() => {
    return isUserInitiator
      ? session!.rating_2_food_1!
      : session!.rating_1_food_1!;
  }, [isUserInitiator, session]);

  const food2UserRating = useMemo(() => {
    return isUserInitiator
      ? session!.rating_1_food_2!
      : session!.rating_2_food_2!;
  }, [isUserInitiator, session]);

  const food2FriendRating = useMemo(() => {
    return isUserInitiator
      ? session!.rating_2_food_2!
      : session!.rating_1_food_2!;
  }, [isUserInitiator, session]);

  const handleClearSession = async () => {
    await deleteMealSession(id, friendId!);
    navigate("/requests");
  };

  return (
    <Box component="section">
      <Stack spacing={5} sx={{ alignItems: "center" }}>
        <Box sx={{ width: "100%", maxWidth: "360px", mx: "auto" }}>
          <FoodCard
            variant={isAutoWon ? "autoWon" : isTie ? "ratedWon" : "ratedWon"}
            foodEntry={rankedFoods[0]}
            averageRating={rankedFoods[0] === food1 ? food1Rating : food2Rating}
            userRating={
              rankedFoods[0] === food1 ? food1UserRating : food2UserRating
            }
            friendRating={
              rankedFoods[0] === food1 ? food1FriendRating : food2FriendRating
            }
          />
        </Box>
        {!isAutoWon && (
          <Box sx={{ width: "100%", maxWidth: "360px", mx: "auto" }}>
            <FoodCard
              variant={isTie ? "ratedWon" : "ratedLost"}
              foodEntry={rankedFoods[1]}
              averageRating={
                rankedFoods[1] === food1 ? food1Rating : food2Rating
              }
              userRating={
                rankedFoods[1] === food1 ? food1UserRating : food2UserRating
              }
              friendRating={
                rankedFoods[1] === food1 ? food1FriendRating : food2FriendRating
              }
            />
          </Box>
        )}
      </Stack>
      <Stack sx={{ flexDirection: "row-reverse", width: "100%", gap: 1 }}>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 5, gap: 1 }}
        >
          <Button
            aria-label="Clear session and go back to requests page"
            variant="outlined"
            onClick={handleClearSession}
          >
            Clear session
          </Button>
          <Button
            component={Link}
            to="/requests"
            aria-label="Close and go back to requests page"
            variant="contained"
          >
            Done
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
