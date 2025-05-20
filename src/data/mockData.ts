import avatar1 from "../assets/avatars/avatar-1.svg";
import avatar2 from "../assets/avatars/avatar-2.svg";
import avatar3 from "../assets/avatars/avatar-3.svg";
import avatar4 from "../assets/avatars/avatar-4.svg";
import avatar5 from "../assets/avatars/avatar-5.svg";
import avatar6 from "../assets/avatars/avatar-6.svg";
import avatar7 from "../assets/avatars/avatar-7.svg";
import avatar8 from "../assets/avatars/avatar-8.svg";
import avatar9 from "../assets/avatars/avatar-9.svg";
import avatar10 from "../assets/avatars/avatar-10.svg";
import avatar11 from "../assets/avatars/avatar-11.svg";
import avatar12 from "../assets/avatars/avatar-12.svg";

export const avatarOptions: string[] = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
];

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

export const mockUsers: Record<string, User> = {
  user_1: {
    id: "user_1",
    username: "JohnDoe123",
    email: "john123doe@abc.def",
    avatar: avatar7,
  },
  user_2: {
    id: "user_2",
    username: "MartinY",
    email: "mar95@abc.def",
    avatar: avatar8,
  },
  user_3: {
    id: "user_3",
    username: "WendyNg",
    email: "wenweng@abc.def",
    avatar: avatar11,
  },
  user_4: {
    id: "user_4",
    username: "alice",
    email: "alice31@abc.def",
    avatar: avatar2,
  },
  user_5: {
    id: "user_5",
    username: "Kate18",
    email: "katewarren@abc.def",
    avatar: avatar3,
  },
  user_6: {
    id: "user_6",
    username: "Nic",
    email: "nic123@abc.def",
    avatar: avatar10,
  },
  user_7: {
    id: "user_7",
    username: "Merry321",
    email: "merry321@abc.def",
    avatar: avatar6,
  },
  user_8: {
    id: "user_8",
    username: "Milly",
    email: "1mills@abc.def",
    avatar: avatar5,
  },
  user_9: {
    id: "user_9",
    username: "berryKC",
    email: "berryyy@abc.def",
    avatar: avatar1,
  },
  user_10: {
    id: "user_10",
    username: "PaulK",
    email: "kpaul@abc.def",
    avatar: avatar12,
  },
  user_11: {
    id: "user_11",
    username: "Elvis",
    email: "elvisel@abc.def",
    avatar: avatar9,
  },
  user_12: {
    id: "user_12",
    username: "Timothy19",
    email: "tim56oth@abc.def",
    avatar: avatar4,
  },
};

export type Friends = Record<string, string[]>;

export const mockFriends: Friends = {
  user_1: [
    "user_2",
    "user_3",
    "user_4",
    "user_5",
    "user_6",
    "user_7",
    "user_8",
    "user_9",
    "user_10",
    "user_11",
    "user_12",
  ],
  user_2: ["user_1", "user_5"],
  user_3: ["user_1", "user_6", "user_7"],
  user_4: ["user_1", "user_8"],
  user_5: ["user_2", "user_9"],
  user_6: ["user_3", "user_10", "user_7", "user_8"],
  user_7: ["user_3"],
  user_8: ["user_4", "user_7"],
  user_9: ["user_5"],
  user_10: ["user_3", "user_4", "user_5", "user_6", "user_7"],
  user_11: ["user_6"],
  user_12: ["user_9", "user_10", "user_11"],
};

export interface FoodEntry {
  id: string;
  name: string;
  type: ("lunch" | "dinner")[];
  location: ("dine in" | "delivery/take out" | "home cooked")[];
  price: {
    min: number;
    max: number;
  };
  maxTime: "up to 1h" | "up to 2h" | "up to 3h" | "3h +";
  cuisine: string[];
  createdBy: string; // user id
}

export const mockFoodEntries: Record<string, FoodEntry> = {
  food_1: {
    id: "food_1",
    name: "Akiko Sushis",
    type: ["dinner"],
    location: ["dine in", "delivery/take out"],
    price: { min: 30, max: 40 },
    maxTime: "up to 2h",
    cuisine: ["japanese"],
    createdBy: "user_1",
  },
  food_2: {
    id: "food_17",
    name: "El's Buffet",
    type: ["lunch", "dinner"],
    location: ["delivery/take out"],
    price: { min: 1, max: 10 },
    maxTime: "3h +",
    cuisine: [
      "british",
      "carribean",
      "french",
      "chinese",
      "japanese",
      "vietnamese",
    ],
    createdBy: "user_1",
  },
  food_3: {
    id: "food_2",
    name: "Pasta Mama",
    type: ["lunch", "dinner"],
    location: ["dine in", "delivery/take out"],
    price: { min: 1, max: 10 },
    maxTime: "up to 1h",
    cuisine: ["italian"],
    createdBy: "user_1",
  },
  food_4: {
    id: "food_4",
    name: "Cafe Brunchz",
    type: ["lunch"],
    location: ["dine in"],
    price: { min: 10, max: 20 },
    maxTime: "up to 2h",
    cuisine: ["british", "french", "coffee shop"],
    createdBy: "user_1",
  },
  food_5: {
    id: "food_11",
    name: "Fried Rice",
    type: ["lunch", "dinner"],
    location: ["home cooked"],
    price: { min: 1, max: 10 },
    maxTime: "up to 1h",
    cuisine: ["chinese"],
    createdBy: "user_1",
  },
  food_6: {
    id: "food_6",
    name: "Poke Bowl",
    type: ["lunch", "dinner"],
    location: ["home cooked"],
    price: { min: 10, max: 20 },
    maxTime: "up to 2h",
    cuisine: ["japanese"],
    createdBy: "user_1",
  },
  food_7: {
    id: "food_8",
    name: "Sandwich Deal",
    type: ["lunch", "dinner"],
    location: ["delivery/take out"],
    price: { min: 1, max: 10 },
    maxTime: "up to 1h",
    cuisine: ["meal deal"],
    createdBy: "user_1",
  },
  food_8: {
    id: "food_7",
    name: "Ramen Forever",
    type: ["lunch", "dinner"],
    location: ["delivery/take out"],
    price: { min: 10, max: 20 },
    maxTime: "up to 2h",
    cuisine: ["japanese"],
    createdBy: "user_1",
  },
  food_9: {
    id: "food_9",
    name: "Wrapped",
    type: ["lunch", "dinner"],
    location: ["delivery/take out"],
    price: { min: 10, max: 20 },
    maxTime: "up to 2h",
    cuisine: ["coffee shop"],
    createdBy: "user_1",
  },
  food_10: {
    id: "food_10",
    name: "Panino's",
    type: ["lunch", "dinner"],
    location: ["dine in", "delivery/take out"],
    price: { min: 1, max: 10 },
    maxTime: "up to 2h",
    cuisine: ["coffee shop"],
    createdBy: "user_1",
  },
  food_11: {
    id: "food_5",
    name: "Tea Rice with Salmon",
    type: ["lunch", "dinner"],
    location: ["home cooked"],
    price: { min: 1, max: 10 },
    maxTime: "3h +",
    cuisine: ["japanese"],
    createdBy: "user_1",
  },
  food_12: {
    id: "food_12",
    name: "Ham and Cheese Loaf",
    type: ["dinner"],
    location: ["home cooked"],
    price: { min: 1, max: 10 },
    maxTime: "up to 3h",
    cuisine: ["french"],
    createdBy: "user_1",
  },
  food_13: {
    id: "food_13",
    name: "Veggie Quiche",
    type: ["lunch", "dinner"],
    location: ["home cooked"],
    price: { min: 1, max: 10 },
    maxTime: "up to 1h",
    cuisine: ["french"],
    createdBy: "user_1",
  },
  food_14: {
    id: "food_14",
    name: "Crepes",
    type: ["dinner"],
    location: ["home cooked"],
    price: { min: 10, max: 20 },
    maxTime: "up to 3h",
    cuisine: ["french"],
    createdBy: "user_1",
  },
  food_15: {
    id: "food_15",
    name: "Steak and Mash",
    type: ["dinner"],
    location: ["home cooked"],
    price: { min: 10, max: 20 },
    maxTime: "up to 2h",
    cuisine: ["british"],
    createdBy: "user_1",
  },
  food_16: {
    id: "food_16",
    name: "Dumplings Palace",
    type: ["lunch", "dinner"],
    location: ["dine in"],
    price: { min: 20, max: 30 },
    maxTime: "3h +",
    cuisine: ["chinese", "japanese"],
    createdBy: "user_1",
  },
  food_17: {
    id: "food_3",
    name: "Carribean Cafe",
    type: ["lunch", "dinner"],
    location: ["delivery/take out"],
    price: { min: 1, max: 10 },
    maxTime: "up to 1h",
    cuisine: ["carribean", "french"],
    createdBy: "user_1",
  },
  food_18: {
    id: "food_18",
    name: "Pasta Place",
    type: ["dinner"],
    location: ["dine in", "delivery/take out"],
    price: { min: 1, max: 10 },
    maxTime: "up to 1h",
    cuisine: ["italian", "spanish"],
    createdBy: "user_1",
  },
  food_19: {
    id: "food_19",
    name: "Viet's Choice",
    type: ["lunch", "dinner"],
    location: ["dine in", "delivery/take out"],
    price: { min: 1, max: 10 },
    maxTime: "up to 2h",
    cuisine: ["vietnamese", "chinese", "japanese"],
    createdBy: "user_1",
  },
  food_20: {
    id: "food_20",
    name: "Tamara's Cafe",
    type: ["lunch", "dinner"],
    location: ["dine in"],
    price: { min: 20, max: 30 },
    maxTime: "up to 1h",
    cuisine: ["coffee shop", "brunch"],
    createdBy: "user_1",
  },
};

export const mockUserFoodLists: Record<string, string[]> = {
  user_1: [
    "food_1",
    "food_2",
    "food_3",
    "food_4",
    "food_5",
    "food_6",
    "food_7",
    "food_8",
    "food_9",
    "food_10",
    "food_11",
    "food_12",
    "food_13",
    "food_14",
    "food_15",
    "food_16",
    "food_17",
    "food_18",
    "food_19",
    "food_20",
  ],
  user_2: [
    "food_11",
    "food_12",
    "food_13",
    "food_14",
    "food_15",
    "food_16",
    "food_17",
    "food_18",
    "food_19",
    "food_20",
  ],
  user_3: [
    "food_1",
    "food_2",
    "food_3",
    "food_4",
    "food_5",
    "food_6",
    "food_7",
    "food_8",
    "food_9",
    "food_10",
  ],
  user_4: ["food_2", "food_3", "food_8"],
  user_5: [],
  user_6: [],
  user_7: [],
  user_8: [],
  user_9: [],
  user_10: [],
  user_11: [],
  user_12: [],
};

export const mockSharedFoodLists: Record<string, string[]> = {
  user_1_user_2: ["food_11", "food_12", "food_13", "food_17", "food_18"],
  user_1_user_3: ["food_1", "food_2", "food_3", "food_7", "food_8"],
  user_1_user_4: ["food_2", "food_3", "food_8"],
  user_1_user_5: [],
  user_1_user_6: [],
  user_1_user_7: [],
  user_1_user_8: [],
  user_1_user_9: [],
  user_1_user_10: [],
  user_1_user_11: [],
  user_1_user_12: [],
};

export type SessionStatus =
  | "invited"
  | "accepted"
  | "preferences_set"
  | "initiator_rated"
  | "receiver_rated"
  | "rated"
  | "cancelled";

export type Rating = {
  initiatorPick: number;
  receiverPick: number;
};

export interface MealPreferencesData {
  type: "lunch" | "dinner";
  location: ("dine in" | "delivery/take out" | "home cooked" | "any")[];
  price:
    | {
        min: number;
        max: number;
      }
    | "any";
  maxTime: "up to 1h" | "up to 2h" | "up to 3h" | "3h +" | "any";
  cuisine: string[];
}

export interface MealSession {
  sessionId: string;
  initiatorId: string;
  receiverId: string;
  status: SessionStatus;
  initiatorPreferences?: MealPreferencesData;
  receiverPreferences?: MealPreferencesData;
  initiatorRating?: Rating;
  receiverRating?: Rating;
}

export const mockMealSessions: Record<string, MealSession> = {
  user_1_user_2: {
    sessionId: "user_1_user_2",
    initiatorId: "user_1",
    receiverId: "user_2",
    status: "invited",
    initiatorPreferences: {
      type: "dinner",
      location: ["dine in"],
      price: { min: 20, max: 30 },
      maxTime: "up to 2h",
      cuisine: ["japanese", "french"],
    },
  },
  user_1_user_3: {
    sessionId: "user_1_user_3",
    initiatorId: "user_1",
    receiverId: "user_3",
    status: "invited",
    initiatorPreferences: {
      type: "lunch",
      location: ["dine in"],
      price: { min: 10, max: 20 },
      maxTime: "up to 2h",
      cuisine: ["italian", "french"],
    },
  },
};
