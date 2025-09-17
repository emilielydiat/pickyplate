import { MealSession, MealSessionStage } from "../types";

export const determineIfUserIsInitiator = (
  userId: string,
  session: MealSession,
) => session.initiator_id === userId;

export const getMealSessionStage = (
  userId: string,
  session: MealSession | null,
) => {
  if (!session) return MealSessionStage.NotStarted;

  const {
    preferences_1,
    preferences_2,
    rating_1_food_1,
    rating_1_food_2,
    rating_2_food_1,
    rating_2_food_2,
  } = session;

  const isCurrentUserInitiator = determineIfUserIsInitiator(userId, session);

  // Preferences statuses

  if (!preferences_1 && !preferences_2)
    return MealSessionStage.AwaitingPreferencesFromBoth;

  if (!preferences_1 && preferences_2)
    return isCurrentUserInitiator
      ? MealSessionStage.AwaitingPreferencesFromCurrentUser
      : MealSessionStage.AwaitingPreferencesFromFriend;

  if (preferences_1 && !preferences_2)
    return isCurrentUserInitiator
      ? MealSessionStage.AwaitingPreferencesFromFriend
      : MealSessionStage.AwaitingPreferencesFromCurrentUser;

  // Rating statuses

  if (
    !rating_1_food_1 &&
    !rating_1_food_2 &&
    !rating_2_food_1 &&
    !rating_2_food_2
  )
    return MealSessionStage.AwaitingRatingFromBoth;

  if (!rating_1_food_1 && !rating_1_food_2)
    return isCurrentUserInitiator
      ? MealSessionStage.AwaitingRatingFromCurrentUser
      : MealSessionStage.AwaitingRatingFromFriend;

  if (!rating_2_food_1 && !rating_2_food_2)
    return isCurrentUserInitiator
      ? MealSessionStage.AwaitingRatingFromFriend
      : MealSessionStage.AwaitingRatingFromCurrentUser;

  return MealSessionStage.Completed;
};
