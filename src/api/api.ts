import {
  mockUsers,
  mockFriends,
  User,
  mockFoodEntries,
  mockUserFoodLists,
  mockSharedFoodLists,
  FoodEntry,
  MealSession,
  mockMealSessions,
} from "../data/mockData";
import { getSessionId } from "../utils/sessionUtils";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUserDataById = async (userId: string): Promise<User | null> => {
  await delay(500);

  return mockUsers[userId] || null;
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // later: get auth user
    const userId = "user_1";
    return await getUserDataById(userId);
  } catch (error) {
    console.error("Error fetching current user: ", error);
    return null;
  }
};

export const getCurrentUserFriends = async (
  userId: string
): Promise<User[]> => {
  try {
    await delay(500);

    const friends = mockFriends[userId] || [];
    return friends.map((id) => mockUsers[id]).filter(Boolean);
  } catch (error) {
    console.error(`Error fetching friends for user ${userId}: `, error);
    return [];
  }
};

export const addFriend = async (
  userId: string,
  friendId: string
): Promise<void> => {
  await delay(500);

  if (!mockFriends[userId]) {
    mockFriends[userId] = [];
    // console.log("addFriend: User or friends not defined yet");
  }
  if (!mockFriends[userId].includes(friendId)) {
    mockFriends[userId].push(friendId);
  }
};

export const removeFriend = async (
  userId: string,
  friendId: string
): Promise<void> => {
  await delay(500);

  if (mockFriends[userId]) {
    mockFriends[userId] = mockFriends[userId].filter((id) => id !== friendId);
  } else {
    // console.log("removeFriend: User or friends not defined yet");
  }
};

export const getCurrentUserFoodList = async (
  userId: string
): Promise<FoodEntry[]> => {
  try {
    await delay(500);

    const userFoodList = mockUserFoodLists[userId] || [];
    return userFoodList.map((id) => mockFoodEntries[id]).filter(Boolean);
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
