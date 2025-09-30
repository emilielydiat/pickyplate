import supabase from "../supabase";
import {
  User,
  FriendRequest,
  FoodEntry,
  MealSession,
  MealSessionPreferences,
} from "../types";

export const getFriendRequests = async (): Promise<{
  users: User[];
  requests: FriendRequest[];
}> => {
  const { data, error } = await supabase.functions.invoke(
    "get-friend-requests"
  );

  if (error) throw new Error(error.message);

  return data;
};

export const confirmFriendRequest = (
  action: "accept" | "reject",
  initiatorId: string
) => {
  return supabase.functions.invoke("confirm-friend-request", {
    body: { action, initiator_id: initiatorId },
  });
};

export const removeFriend = (userId: string) => {
  return supabase.functions.invoke("remove-friend", {
    body: { target_id: userId },
  });
};

export const searchUsers = async (name: string) => {
  const { data, error } = await supabase
    .from("user_profile")
    .select()
    .ilike("name", `${name}%`);

  if (error) throw new Error(error.message);

  return data;
};

// Similar to the one above. We will gradually replace the above with this one.
export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("user_profile")
    .select()
    .eq("id", id);

  if (error) throw new Error(error.message);

  return data[0] ?? null;
};

export const getAvailableAvatars = async () => {
  const { data, error } = await supabase.storage.from("avatars").list("", {
    sortBy: { column: "name", order: "asc" },
  });

  if (error) throw new Error(error.message);

  return data;
};

export const updateUserProfile = async (
  id: string,
  payload: { name?: string; avatar?: string }
) => {
  const { error } = await supabase
    .from("user_profile")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const getCurrentUserFriends = async (): Promise<User[]> => {
  const { data, error } = await supabase.functions.invoke("get-friends");

  if (error) throw new Error(error.message);

  return data;
};

export const addFriend = async (userId: string) => {
  const { error } = await supabase.functions.invoke("send-friend-request", {
    body: {
      target_id: userId,
    },
  });

  if (error) throw new Error(error.message);
};

export const getFoodList = async (userId: string): Promise<FoodEntry[]> => {
  const { data, error } = await supabase
    .from("food_list")
    .select()
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  return data;
};

export const getFoodEntryById = async (id: string): Promise<FoodEntry> => {
  const { error, data } = await supabase
    .from("food_list")
    .select()
    .eq("id", id);

  if (error) throw new Error(error.message);

  return data[0];
};

export const addFoodEntry = async (
  userId: string,
  entry: FoodEntry
): Promise<FoodEntry> => {
  const { data, error } = await supabase
    .from("food_list")
    .insert({
      ...entry,
      user_id: userId,
    })
    .select();

  if (error) throw new Error(error.message);

  return data[0];
};

export const editFoodEntry = async (id: string, entry: FoodEntry) => {
  const { error } = await supabase
    .from("food_list")
    .update({ ...entry })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const deleteFoodEntry = async (id: string) => {
  const { error } = await supabase.from("food_list").delete().eq("id", id);

  if (error) throw new Error(error.message);
};

export const getCuisines = async (): Promise<string[]> => {
  const { data, error } = await supabase.functions.invoke("get-cuisines");

  if (error) throw new Error(error.message);

  return data;
};

export const getSharedFoodList = async (
  friendId: string
): Promise<FoodEntry[]> => {
  const { data, error } = await supabase.functions.invoke(
    "get-shared-food-list",
    { body: { friendId } }
  );

  if (error) throw new Error(error.message);

  return data;
};

export const addFoodEntryToSharedList = async (
  userId: string,
  friendId: string,
  foodId: string
) => {
  const { error } = await supabase.from("shared_food_list").insert({
    sharer_id: userId,
    user_id: friendId,
    food_id: foodId,
  });

  if (error) throw new Error(error.message);
};

export const removeFoodEntryFromSharedList = async (
  userId: string,
  friendId: string,
  foodId: string
): Promise<void> => {
  const { error } = await supabase
    .from("shared_food_list")
    .delete()
    .eq("food_id", foodId)
    .eq("sharer_id", userId)
    .eq("user_id", friendId);

  if (error) throw new Error(error.message);
};

export const getMealSessions = async (
  userId: string
): Promise<MealSession[]> => {
  const { data, error } = await supabase
    .from("meal_sessions")
    .select("*")
    .or(`initiator_id.eq.${userId},friend_id.eq.${userId})`);

  if (error) throw new Error(error.message);

  return data;
};

export const getMealSession = async (
  friendId: string
): Promise<MealSession | null> => {
  const { data, error } = await supabase.functions.invoke("get-meal-session", {
    body: { friend_id: friendId },
  });

  if (error) throw new Error(error.message);

  return data || null;
};

export const submitMealSessionPreferences = async (
  friendId: string,
  preferences: MealSessionPreferences
): Promise<MealSession> => {
  const { data, error } = await supabase.functions.invoke(
    "submit-meal-session-preferences",
    {
      body: { friend_id: friendId, preferences },
    }
  );

  if (error) throw new Error(error.message);

  return data;
};

export const submitMealSessionRating = async (
  friendId: string,
  food1Rating: number,
  food2Rating: number
): Promise<MealSession> => {
  const { data, error } = await supabase.functions.invoke(
    "submit-meal-session-rating",
    {
      body: {
        friend_id: friendId,
        food_rating1: food1Rating,
        food_rating2: food2Rating,
      },
    }
  );

  if (error) throw new Error(error.message);

  return data;
};

export const deleteMealSession = async (userId: string, friendId: string) => {
  const { error } = await supabase
    .from("meal_sessions")
    .delete()
    .or(
      `and(initiator_id.eq.${userId},friend_id.eq.${friendId}),and(friend_id.eq.${userId},initiator_id.eq.${friendId})`
    );

  if (error) throw new Error(error.message);
};
