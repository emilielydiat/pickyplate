import {
  mockUsers,
  mockFriends,
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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAllUsers = async (): Promise<User[]> => {
  try {
    await delay(500);
    return Object.values(mockUsers);
  } catch (error) {
    console.error("Error getting all user: ", error);
    return [];
  }
};

export const getUsersNotFriendsWith = async (
  userId: string
): Promise<User[]> => {
  // get all users
  const [allUsers, currentFriends] = await Promise.all([
    getAllUsers(),
    getCurrentUserFriends(userId),
  ]);
  const friendIds = new Set(currentFriends.map((friend) => friend.id));

  return allUsers.filter(
    (user) => user.id !== userId && !friendIds.has(user.id)
  );
};

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
): Promise<boolean> => {
  try {
    await delay(500);

    if (!mockFriends[userId]) {
      mockFriends[userId] = [];
      // console.log(`Initialized empty friend list for user ${userId}`);
    }
    if (mockFriends[userId].includes(friendId)) {
      // console.log(`${friendId} is already a friend of ${userId}`);
      return true;
    }

    mockFriends[userId].push(friendId);
    // console.log(`${friendId} added to friend list`);
    return true;
  } catch (error) {
    console.error(`Error adding friend ${friendId}: `, error);
    return false;
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
    console.log("Current user has no friends defined yet");
  }
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
