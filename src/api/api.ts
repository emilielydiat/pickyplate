import {
  mockUsers,
  User,
  mockFoodEntries,
  mockUserFoodLists,
  mockSharedFoodLists,
  FoodEntry,
  mealPriceLookup,
  MealSession,
  mockMealSessions,
} from "../data/mockData";
import { getSessionId } from "../utils/sessionUtils";
import { v4 as uuidv4 } from "uuid";
import supabase from "../supabase";
import { FriendRequest, type User as SupabaseUser } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUserDataById = async (userId: string): Promise<User | null> => {
  await delay(500);

  return mockUsers[userId] || null;
};

export const getFriendRequests = async (): Promise<{
  users: SupabaseUser[];
  requests: FriendRequest[];
}> => {
  const { data, error } = await supabase.functions.invoke(
    "get-friend-requests",
  );

  if (error) throw new Error(error.message);

  return data;
};

export const confirmFriendRequest = (
  action: "accept" | "reject",
  initiatorId: string,
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
export const getUserById = async (id: string): Promise<SupabaseUser | null> => {
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
  payload: { name?: string; avatar?: string },
) => {
  const { error } = await supabase
    .from("user_profile")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export const getCurrentUserFriends = async (): Promise<SupabaseUser[]> => {
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

export const updateFoodEntry = async (
  draft: FoodEntry
): Promise<FoodEntry | null> => {
  try {
    await delay(500);

    const { id } = draft;

    if (!mockFoodEntries[id]) {
      console.error(`No food entry found with id ${id}`);
      return null;
    }
    mockFoodEntries[id] = draft;

    return draft;
  } catch (error) {
    console.error(`Error updating food entry with id ${draft.id}:`, error);
    return null;
  }
};

export const createFoodEntry = async (
  userId: string,
  draft: Omit<FoodEntry, "id">
): Promise<FoodEntry | null> => {
  try {
    await delay(500);

    const id = `food_${uuidv4()}`;
    const price =
      typeof draft.price === "string"
        ? mealPriceLookup[draft.price]
        : draft.price;
    const createdBy = userId;
    const newEntry: FoodEntry = { ...draft, id, price, createdBy };

    mockFoodEntries[id] = newEntry;

    if (!mockUserFoodLists[createdBy]) {
      mockUserFoodLists[createdBy] = [];
    }
    mockUserFoodLists[createdBy].push(id);

    return newEntry;
  } catch (error) {
    console.error(
      `Error creating food entry for user ${userId} personal list: `,
      error
    );
    return null;
  }
};

export const createSharedFoodEntry = async (
  userId: string,
  friendId: string,
  draft: Omit<FoodEntry, "id">
): Promise<FoodEntry | null> => {
  try {
    await delay(500);

    const newEntry = await createFoodEntry(userId, draft);

    if (newEntry) {
      const id = newEntry.id;

      if (!mockUserFoodLists[friendId]) {
        mockUserFoodLists[friendId] = [];
      }
      mockUserFoodLists[friendId].push(id);

      const key = getSessionId(userId, friendId);

      if (!mockSharedFoodLists[key]) {
        mockSharedFoodLists[key] = [];
      }

      mockSharedFoodLists[key].push(id);

      return newEntry;
    }

    console.log("Could not create shared food entry");
    return null;
  } catch (error) {
    console.error(
      `Error creating food entry for user ${userId} personal list: `,
      error
    );
    return null;
  }
};

export const getCurrentUserFoodList = async (
  userId: string
): Promise<FoodEntry[]> => {
  try {
    await delay(500);

    return (mockUserFoodLists[userId] || [])
      .map((id) => mockFoodEntries[id])
      .filter(
        (entry): entry is FoodEntry => entry !== undefined && entry !== null
      );
  } catch (error) {
    console.error(`Error fetching food list for user ${userId}: `, error);
    return [];
  }
};

export const getSharedFoodList = async (
  userId: string,
  friendId: string
): Promise<FoodEntry[]> => {
  try {
    await delay(500);

    const key = `${userId}_${friendId}`;
    const sharedFoodList = mockSharedFoodLists[key] || [];
    return sharedFoodList.map((id) => mockFoodEntries[id]).filter(Boolean);
  } catch (error) {
    console.error(
      `Error fetching shared food list between users ${userId} and ${friendId}: `,
      error
    );
    return [];
  }
};

export const updateSharedFoodList = async (
  userId: string,
  friendId: string,
  updatedSharedList: string[]
): Promise<void> => {
  try {
    await delay(500);
    const key = `${userId}_${friendId}`;
    mockSharedFoodLists[key] = updatedSharedList;
  } catch (error) {
    console.error(
      `Error updating shared food list between users ${userId} and ${friendId}: `,
      error
    );
  }
};

export const updateMyFoodList = async (
  userId: string,
  updatedList: string[]
): Promise<void> => {
  try {
    await delay(500);
    mockUserFoodLists[userId] = updatedList;
  } catch (error) {
    console.error(`Error updating my food list`, error);
  }
};

export const getMealSession = async (
  userId1: string,
  userId2: string
): Promise<MealSession | null> => {
  try {
    await delay(500);
    const key = getSessionId(userId1, userId2);
    const session = mockMealSessions[key];
    if (!session) {
      console.log(`No session found for ${key}`);
      return null;
    }
    return session;
  } catch (error) {
    console.error(
      `Error fetching session between users ${userId1} and ${userId2}: `,
      error
    );
    return null;
  }
};

export type AllUserSessionsSummary = {
  initiatorId: string;
  status: MealSession["status"];
  friendId: string;
};
export const getAllMealSessionsForUser = async (
  userId: string
): Promise<AllUserSessionsSummary[]> => {
  try {
    await delay(500);
    const allSessions = Object.values(mockMealSessions);
    const userSessions = allSessions
      .filter(
        (session) =>
          session.initiatorId === userId || session.receiverId === userId
      )
      .map((session) => {
        const friendId =
          session.initiatorId === userId
            ? session.receiverId
            : session.initiatorId;
        return {
          initiatorId: session.initiatorId,
          status: session.status,
          friendId,
        };
      });
    return userSessions;
  } catch (error) {
    console.error(`Error fetching all sessions for user ${userId}: `, error);
    return [];
  }
};

export const updateMealSession = async (
  initiatorId: string,
  receiverId: string,
  updates: Partial<MealSession>
): Promise<void> => {
  try {
    await delay(500);
    const key = getSessionId(initiatorId, receiverId);
    const session = mockMealSessions[key];
    if (session) {
      mockMealSessions[key] = {
        ...session,
        ...updates,
      };
      console.log(`Session updated for ${key}`);
    } else {
      mockMealSessions[key] = {
        sessionId: key,
        initiatorId: initiatorId,
        receiverId: receiverId,
        status: "invited",
        ...updates,
      };
      console.log(`Session created for ${key}`);
      return;
    }
  } catch (error) {
    console.error(
      `Error creating/updating session between users ${initiatorId} and ${receiverId}: `,
      error
    );
  }
};

export const resetMealSession = async (
  initiatorId: string,
  receiverId: string
): Promise<void> => {
  try {
    await updateMealSession(initiatorId, receiverId, {
      initiatorId: undefined,
      receiverId: undefined,
      status: "cancelled",
      initiatorPreferences: undefined,
      receiverPreferences: undefined,
      initiatorOption: undefined,
      receiverOption: undefined,
      initiatorRating: undefined,
      receiverRating: undefined,
    });
    console.log(`Session reset between users ${initiatorId} and ${receiverId}`);
  } catch (error) {
    console.error(
      `Error resetting session between users ${initiatorId} and ${receiverId}: `,
      error
    );
  }
};
