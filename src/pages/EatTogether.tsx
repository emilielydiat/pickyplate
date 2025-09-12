import { Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FoodEntry, MealSession, MealSessionStage, User } from "../types";
import { getMealSession, getSharedFoodList, getUserById } from "../api/api";
import { EatTogetherContext } from "../context/EatTogetherContext";
import { getMealSessionStage } from "../utils/mealSession";
import { useUserContext } from "../context/UserContext";
import { MealPreferences } from "./MealPreferences";
import { SubmitRating } from "./SubmitRating";
import { ViewResults } from "./ViewResults";
import { AppDialog } from "../components/AppDialog";

export function EatTogether() {
  const { friendId } = useParams();
  const { id } = useUserContext();
  const navigate = useNavigate();

  const [isInitialised, setIsInitialised] = useState(false);
  const [session, setSession] = useState<MealSession | null>(null);
  const [sharedFoodList, setSharedFoodList] = useState<FoodEntry[]>([]);
  const [friend, setFriend] = useState<User | null>(null);

  const sessionStatus = useMemo<MealSessionStage>(
    () => getMealSessionStage(id, session),
    [id, session],
  );

  const reloadSession = async () => {
    const _session = await getMealSession(friendId!);
    setSession(_session);
  };

  useEffect(() => {
    (async () => {
      setIsInitialised(false);

      const [_session, _friend, foodList] = await Promise.all([
        getMealSession(friendId!),
        getUserById(friendId!),
        getSharedFoodList(friendId!),
      ]);

      setSession(_session);
      setFriend(_friend);
      setSharedFoodList(foodList);

      setIsInitialised(true);
    })();
  }, [friendId]);

  if (!isInitialised) return <Typography>Loading...</Typography>;

  if (sharedFoodList.length === 0) {
    return (
      <AppDialog
        open
        withTextField={false}
        titleText="Oops, no shared food to pick from"
        contentText="Your food list with this friend is empty! Add some food to explore your next meal together."
        primaryBtnLabel="Add food"
        secondaryBtnLabel="Close"
        onSecondaryAction={() => {
          navigate("/pick-friend");
        }}
        onPrimaryAction={() => {
          navigate(`/friend/${friendId}/shared-food-list`);
        }}
        onClose={() => {
          navigate("/pick-friend");
        }}
      />
    );
  }

  return (
    <EatTogetherContext.Provider
      value={{ friend: friend!, session, sharedFoodList, reloadSession }}
    >
      {[
        MealSessionStage.NotStarted,
        MealSessionStage.AwaitingPreferencesFromBoth,
        MealSessionStage.AwaitingPreferencesFromCurrentUser,
      ].includes(sessionStatus!) && <MealPreferences />}

      {sessionStatus === MealSessionStage.AwaitingPreferencesFromFriend &&
        "Waiting for preferences..."}

      {[
        MealSessionStage.AwaitingRatingFromBoth,
        MealSessionStage.AwaitingRatingFromCurrentUser,
      ].includes(sessionStatus) && <SubmitRating />}

      {sessionStatus === MealSessionStage.Completed && <ViewResults />}
    </EatTogetherContext.Provider>
  );
}
