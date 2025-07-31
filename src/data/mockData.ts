import avatar1 from "../assets/avatars/avatar-1.png";
import avatar2 from "../assets/avatars/avatar-2.png";
import avatar3 from "../assets/avatars/avatar-3.png";
import avatar4 from "../assets/avatars/avatar-4.png";
import avatar5 from "../assets/avatars/avatar-5.png";
import avatar6 from "../assets/avatars/avatar-6.png";
import avatar7 from "../assets/avatars/avatar-7.png";
import avatar8 from "../assets/avatars/avatar-8.png";
import avatar9 from "../assets/avatars/avatar-9.png";
import avatar10 from "../assets/avatars/avatar-10.png";
import avatar11 from "../assets/avatars/avatar-11.png";
import avatar12 from "../assets/avatars/avatar-12.png";
import avatar13 from "../assets/avatars/avatar-13.png";
import avatar14 from "../assets/avatars/avatar-14.png";
import avatar15 from "../assets/avatars/avatar-15.png";
import avatar16 from "../assets/avatars/avatar-16.png";
import avatar17 from "../assets/avatars/avatar-17.png";
import avatar18 from "../assets/avatars/avatar-18.png";
import avatar19 from "../assets/avatars/avatar-19.png";
import avatar20 from "../assets/avatars/avatar-20.png";

import emptyMyFoodListImage from "../assets/empty-states/my-food-list-empty.png";
import emptySharedFoodListImage from "../assets/empty-states/shared-food-list-empty.png";
import emptyFriendsImage from "../assets/empty-states/friends-empty.png";
import emptyPickAFriendImage from "../assets/empty-states/pick-a-friend-empty.png";
import emptyAddFriendImage from "../assets/empty-states/add-friend-empty.png";

export const emptyStateImages = {
  myFoodList: emptyMyFoodListImage,
  sharedFoodList: emptySharedFoodListImage,
  friends: emptyFriendsImage,
  pickAFriend: emptyPickAFriendImage,
  addFriend: emptyAddFriendImage,
} as const;

export type emptyStateImagesKey = keyof typeof emptyStateImages;

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
  avatar13,
  avatar14,
  avatar15,
  avatar16,
  avatar17,
  avatar18,
  avatar19,
  avatar20,
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
    username: "James",
    email: "jam.es10@abc.def",
    avatar: avatar4,
  },
  user_13: {
    id: "user_13",
    username: "Amy",
    email: "amyyy@abc.def",
    avatar: avatar10,
  },
  user_14: {
    id: "user_14",
    username: "Jackie",
    email: "jack.ie@abc.def",
    avatar: avatar6,
  },
  user_15: {
    id: "user_15",
    username: "Jenna",
    email: "najen@abc.def",
    avatar: avatar5,
  },
  user_16: {
    id: "user_16",
    username: "Mar",
    email: "mar098@abc.def",
    avatar: avatar1,
  },
  user_17: {
    id: "user_17",
    username: "PauLine",
    email: "pau.line@abc.def",
    avatar: avatar12,
  },
  user_18: {
    id: "user_18",
    username: "Ava",
    email: "3ava@abc.def",
    avatar: avatar9,
  },
  user_19: {
    id: "user_19",
    username: "Dave",
    email: "dave567@abc.def",
    avatar: avatar4,
  },
  user_20: {
    id: "user_20",
    username: "Tim",
    email: "87tim@abc.def",
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

// Meal Preferences Option Values
export const mealTypeOptions = ["lunch", "dinner"] as const;
export type MealType = "lunch" | "dinner";

export const mealLocationOptions = [
  "dine in",
  "delivery/take out",
  "home cooked",
] as const;
export const mealLocationOptionsWithAny = [
  ...mealLocationOptions,
  "any",
] as const;
export type MealLocation = (typeof mealLocationOptions)[number];
export type MealLocationWithAny = MealLocation | "any";

export const mealPriceOptions = [
  { key: "1-10", label: "£1-10", min: 1, max: 10 },
  { key: "10-20", label: "£10-20", min: 10, max: 20 },
  { key: "20-30", label: "£20-30", min: 20, max: 30 },
  { key: "30-40", label: "£30-40", min: 30, max: 40 },
  { key: "40-50", label: "£40-50", min: 40, max: 50 },
  { key: "50-60", label: "£50-60", min: 50, max: 60 },
  { key: "60-70", label: "£60-70", min: 60, max: 70 },
  { key: "70+", label: "£70+", min: 70, max: Infinity },
] as const;
export const mealPriceOptionsWithAny = [
  ...mealPriceOptions,
  { key: "any", label: "Any", min: 0, max: Infinity },
] as const;
export type MealPrice = {
  min: number;
  max: number;
  key: string;
  label: string;
};
export type MealPriceWithAny = MealPrice;
export const mealPriceLookup: Record<string, MealPrice> = Object.fromEntries(
  mealPriceOptions.map((option) => [option.key, option])
);

export const mealMaxTimeOptions = [
  "up to 1h",
  "up to 2h",
  "up to 3h",
  "3h +",
] as const;
export const mealMaxTimeOptionsWithAny = [
  ...mealMaxTimeOptions,
  "any",
] as const;
export type MealMaxTime = (typeof mealMaxTimeOptions)[number];
export type MealMaxTimeWithAny = MealMaxTime | "any";

export interface MealPreferencesData {
  type: MealType;
  location: MealLocationWithAny[];
  price: MealPrice;
  maxTime: MealMaxTimeWithAny;
  cuisine: string[];
}

export interface FoodEntry {
  id: string;
  name: string;
  type: MealType[];
  location: MealLocation[];
  price: MealPrice;
  maxTime: MealMaxTime;
  cuisine: string[];
  createdBy: string; // user id
}

export const mockFoodEntries: Record<string, FoodEntry> = {
  food_1: {
    id: "food_1",
    name: "Akiko Sushis",
    type: ["dinner"],
    location: ["dine in", "delivery/take out"],
    price: mealPriceLookup["30-40"],
    maxTime: "up to 2h",
    cuisine: ["japanese"],
    createdBy: "user_1",
  },
  food_2: {
    id: "food_2",
    name: "El's Buffet",
    type: ["lunch", "dinner"],
    location: ["delivery/take out"],
    price: mealPriceLookup["1-10"],
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
    id: "food_3",
    name: "Pasta Mama",
    type: ["lunch", "dinner"],
    location: ["dine in", "delivery/take out"],
    price: mealPriceLookup["1-10"],
    maxTime: "up to 1h",
    cuisine: ["italian"],
    createdBy: "user_1",
  },
  food_4: {
    id: "food_4",
    name: "Cafe Brunchz",
    type: ["lunch"],
    location: ["dine in"],
    price: mealPriceLookup["10-20"],
    maxTime: "up to 2h",
    cuisine: ["british", "french", "coffee shop"],
    createdBy: "user_1",
  },
  food_5: {
    id: "food_5",
    name: "Fried Rice",
    type: ["lunch", "dinner"],
    location: ["home cooked"],
    price: mealPriceLookup["1-10"],
    maxTime: "up to 1h",
    cuisine: ["chinese"],
    createdBy: "user_1",
  },
  food_6: {
    id: "food_6",
    name: "Poke Bowl",
    type: ["lunch", "dinner"],
    location: ["home cooked"],
    price: mealPriceLookup["10-20"],
    maxTime: "up to 2h",
    cuisine: ["japanese"],
    createdBy: "user_1",
  },
  food_7: {
    id: "food_7",
    name: "Sandwich Deal",
    type: ["lunch", "dinner"],
    location: ["delivery/take out"],
    price: mealPriceLookup["1-10"],
    maxTime: "up to 1h",
    cuisine: ["meal deal"],
    createdBy: "user_1",
  },
  food_8: {
    id: "food_8",
    name: "Ramen Forever",
    type: ["lunch", "dinner"],
    location: ["delivery/take out"],
    price: mealPriceLookup["10-20"],
    maxTime: "up to 2h",
    cuisine: ["japanese"],
    createdBy: "user_1",
  },
  food_9: {
    id: "food_9",
    name: "Wrapped",
    type: ["lunch", "dinner"],
    location: ["delivery/take out"],
    price: mealPriceLookup["10-20"],
    maxTime: "up to 2h",
    cuisine: ["coffee shop"],
    createdBy: "user_1",
  },
  food_10: {
    id: "food_10",
    name: "Panino's",
    type: ["lunch", "dinner"],
    location: ["dine in", "delivery/take out"],
    price: mealPriceLookup["1-10"],
    maxTime: "up to 2h",
    cuisine: ["coffee shop"],
    createdBy: "user_1",
  },
  food_11: {
    id: "food_11",
    name: "Tea Rice with Salmon",
    type: ["lunch", "dinner"],
    location: ["home cooked"],
    price: mealPriceLookup["1-10"],
    maxTime: "3h +",
    cuisine: ["japanese"],
    createdBy: "user_1",
  },
  food_12: {
    id: "food_12",
    name: "Ham and Cheese Loaf",
    type: ["dinner"],
    location: ["home cooked"],
    price: mealPriceLookup["1-10"],
    maxTime: "up to 3h",
    cuisine: ["french"],
    createdBy: "user_1",
  },
  food_13: {
    id: "food_13",
    name: "Veggie Quiche",
    type: ["lunch", "dinner"],
    location: ["home cooked"],
    price: mealPriceLookup["1-10"],
    maxTime: "up to 1h",
    cuisine: ["french"],
    createdBy: "user_1",
  },
  food_14: {
    id: "food_14",
    name: "Crepes",
    type: ["dinner"],
    location: ["home cooked"],
    price: mealPriceLookup["10-20"],
    maxTime: "up to 3h",
    cuisine: ["french"],
    createdBy: "user_1",
  },
  food_15: {
    id: "food_15",
    name: "Steak and Mash",
    type: ["dinner"],
    location: ["home cooked"],
    price: mealPriceLookup["10-20"],
    maxTime: "up to 2h",
    cuisine: ["british"],
    createdBy: "user_1",
  },
  food_16: {
    id: "food_16",
    name: "Dumplings Palace",
    type: ["lunch", "dinner"],
    location: ["dine in"],
    price: mealPriceLookup["20-30"],
    maxTime: "3h +",
    cuisine: ["chinese", "japanese"],
    createdBy: "user_1",
  },
  food_17: {
    id: "food_17",
    name: "Carribean Cafe",
    type: ["lunch", "dinner"],
    location: ["delivery/take out"],
    price: mealPriceLookup["1-10"],
    maxTime: "up to 1h",
    cuisine: ["carribean", "french"],
    createdBy: "user_1",
  },
  food_18: {
    id: "food_18",
    name: "Pasta Place",
    type: ["dinner"],
    location: ["dine in", "delivery/take out"],
    price: mealPriceLookup["1-10"],
    maxTime: "up to 1h",
    cuisine: ["italian", "spanish"],
    createdBy: "user_1",
  },
  food_19: {
    id: "food_19",
    name: "Viet's Choice",
    type: ["lunch", "dinner"],
    location: ["dine in", "delivery/take out"],
    price: mealPriceLookup["1-10"],
    maxTime: "up to 2h",
    cuisine: ["vietnamese", "chinese", "japanese"],
    createdBy: "user_1",
  },
  food_20: {
    id: "food_20",
    name: "Tamara's Cafe",
    type: ["lunch", "dinner"],
    location: ["dine in"],
    price: mealPriceLookup["20-30"],
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
  | "rejected"
  | "everyone_preferences_set"
  | "initiator_rated"
  | "receiver_rated"
  | "everyone_rated"
  | "cancelled";

export type Rating = {
  initiatorOption: number;
  receiverOption: number;
};

export interface MealSession {
  sessionId: string;
  initiatorId: string;
  receiverId: string;
  status: SessionStatus;
  initiatorPreferences?: MealPreferencesData;
  receiverPreferences?: MealPreferencesData;
  initiatorOption?: FoodEntry;
  receiverOption?: FoodEntry;
  initiatorRating?: Rating;
  receiverRating?: Rating;
}

export const mockMealSessions: Record<string, MealSession> = {
  user_1_user_2: {
    sessionId: "user_1_user_2",
    initiatorId: "user_1",
    receiverId: "user_2",
    status: "everyone_preferences_set",
    initiatorPreferences: {
      type: "dinner",
      location: ["dine in", "home cooked"],
      price: mealPriceLookup["20-30"],
      maxTime: "up to 2h",
      cuisine: ["japanese", "french"],
    },
    receiverPreferences: {
      type: "dinner",
      location: ["home cooked"],
      price: mealPriceLookup["10-20"],
      maxTime: "up to 1h",
      cuisine: ["french", "coffee shop"],
    },
    initiatorOption: {
      id: "food_1",
      name: "Akiko Sushis",
      type: ["dinner"],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["30-40"],
      maxTime: "up to 2h",
      cuisine: ["japanese"],
      createdBy: "user_1",
    },
    receiverOption: {
      id: "food_3",
      name: "Pasta Mama",
      type: ["lunch", "dinner"],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 1h",
      cuisine: ["italian"],
      createdBy: "user_1",
    },
  },
  user_1_user_3: {
    sessionId: "user_1_user_3",
    initiatorId: "user_1",
    receiverId: "user_3",
    status: "invited",
    initiatorPreferences: {
      type: "lunch",
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["10-20"],
      maxTime: "up to 2h",
      cuisine: ["italian", "french"],
    },
    initiatorOption: {
      id: "food_3",
      name: "Pasta Mama",
      type: ["lunch", "dinner"] as MealType[],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 1h" as MealMaxTime,
      cuisine: ["italian"],
      createdBy: "user_1",
    },
  },
  user_1_user_4: {
    sessionId: "user_1_user_4",
    initiatorId: "user_4",
    receiverId: "user_1",
    status: "invited",
    initiatorPreferences: {
      type: "lunch",
      location: ["delivery/take out"],
      price: mealPriceLookup["10-20"],
      maxTime: "up to 2h",
      cuisine: ["italian", "french"],
    },
    initiatorOption: {
      id: "food_3",
      name: "Pasta Mama",
      type: ["lunch", "dinner"] as MealType[],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 1h" as MealMaxTime,
      cuisine: ["italian"],
      createdBy: "user_1",
    },
  },
  user_1_user_5: {
    sessionId: "user_1_user_5",
    initiatorId: "user_1",
    receiverId: "user_5",
    status: "accepted",
    initiatorPreferences: {
      type: "lunch",
      location: ["delivery/take out"],
      price: mealPriceLookup["10-20"],
      maxTime: "up to 2h",
      cuisine: ["italian", "french"],
    },
    initiatorOption: {
      id: "food_3",
      name: "Pasta Mama",
      type: ["lunch", "dinner"] as MealType[],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 1h" as MealMaxTime,
      cuisine: ["italian"],
      createdBy: "user_1",
    },
  },
  user_1_user_6: {
    sessionId: "user_1_user_6",
    initiatorId: "user_1",
    receiverId: "user_6",
    status: "receiver_rated",
    initiatorPreferences: {
      type: "dinner",
      location: ["dine in"],
      price: mealPriceLookup["30-40"],
      maxTime: "up to 2h",
      cuisine: ["japanese"],
    },
    receiverPreferences: {
      type: "dinner",
      location: ["dine in", "home cooked"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 2h",
      cuisine: ["italian", "french", "coffee shop"],
    },
    initiatorOption: {
      id: "food_1",
      name: "Akiko Sushis",
      type: ["dinner"],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["30-40"],
      maxTime: "up to 2h",
      cuisine: ["japanese"],
      createdBy: "user_1",
    },
    receiverOption: {
      id: "food_3",
      name: "Pasta Mama",
      type: ["lunch", "dinner"],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 1h",
      cuisine: ["italian"],
      createdBy: "user_1",
    },
    receiverRating: {
      initiatorOption: 2,
      receiverOption: 4,
    },
  },
  user_1_user_7: {
    sessionId: "user_1_user_7",
    initiatorId: "user_1",
    receiverId: "user_7",
    status: "everyone_rated",
    initiatorPreferences: {
      type: "dinner",
      location: ["dine in"],
      price: mealPriceLookup["30-40"],
      maxTime: "up to 2h",
      cuisine: ["japanese"],
    },
    receiverPreferences: {
      type: "dinner",
      location: ["dine in", "home cooked"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 2h",
      cuisine: ["italian", "french", "coffee shop"],
    },
    initiatorOption: {
      id: "food_1",
      name: "Akiko Sushis",
      type: ["dinner"],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["30-40"],
      maxTime: "up to 2h",
      cuisine: ["japanese"],
      createdBy: "user_1",
    },
    receiverOption: {
      id: "food_3",
      name: "Pasta Mama",
      type: ["lunch", "dinner"],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 1h",
      cuisine: ["italian"],
      createdBy: "user_1",
    },
    initiatorRating: {
      initiatorOption: 5,
      receiverOption: 1,
    },
    receiverRating: {
      initiatorOption: 2,
      receiverOption: 4,
    },
  },
  user_1_user_8: {
    sessionId: "user_1_user_8",
    initiatorId: "user_1",
    receiverId: "user_8",
    status: "cancelled",
    initiatorPreferences: {
      type: "dinner",
      location: ["dine in"],
      price: mealPriceLookup["20-30"],
      maxTime: "up to 2h",
      cuisine: ["italian", "french", "coffee shop"],
    },
    receiverPreferences: {
      type: "dinner",
      location: ["home cooked"],
      price: mealPriceLookup["30-40"],
      maxTime: "up to 2h",
      cuisine: ["japanese"],
    },
  },
  user_1_user_9: {
    sessionId: "user_1_user_9",
    initiatorId: "user_1",
    receiverId: "user_9",
    status: "initiator_rated",
    initiatorPreferences: {
      type: "dinner",
      location: ["dine in"],
      price: mealPriceLookup["30-40"],
      maxTime: "up to 2h",
      cuisine: ["japanese"],
    },
    receiverPreferences: {
      type: "dinner",
      location: ["dine in", "home cooked"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 2h",
      cuisine: ["italian", "french", "coffee shop"],
    },
    initiatorOption: {
      id: "food_1",
      name: "Akiko Sushis",
      type: ["dinner"],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["30-40"],
      maxTime: "up to 2h",
      cuisine: ["japanese"],
      createdBy: "user_1",
    },
    receiverOption: {
      id: "food_3",
      name: "Pasta Mama",
      type: ["lunch", "dinner"],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 1h",
      cuisine: ["italian"],
      createdBy: "user_1",
    },
    initiatorRating: {
      initiatorOption: 5,
      receiverOption: 1,
    },
  },
  user_1_user_10: {
    sessionId: "user_1_user_10",
    initiatorId: "user_1",
    receiverId: "user_10",
    status: "rejected",
    initiatorPreferences: {
      type: "dinner",
      location: ["dine in"],
      price: mealPriceLookup["20-30"],
      maxTime: "up to 2h",
      cuisine: ["italian", "french", "coffee shop"],
    },
  },
  user_1_user_11: {
    sessionId: "user_1_user_11",
    initiatorId: "user_11",
    receiverId: "user_1",
    status: "initiator_rated",
    initiatorPreferences: {
      type: "dinner",
      location: ["dine in"],
      price: mealPriceLookup["30-40"],
      maxTime: "up to 2h",
      cuisine: ["japanese"],
    },
    receiverPreferences: {
      type: "dinner",
      location: ["dine in", "home cooked"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 2h",
      cuisine: ["italian", "french", "coffee shop"],
    },
    initiatorOption: {
      id: "food_1",
      name: "Akiko Sushis",
      type: ["dinner"],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["30-40"],
      maxTime: "up to 2h",
      cuisine: ["japanese"],
      createdBy: "user_1",
    },
    receiverOption: {
      id: "food_3",
      name: "Pasta Mama",
      type: ["lunch", "dinner"],
      location: ["dine in", "delivery/take out"],
      price: mealPriceLookup["1-10"],
      maxTime: "up to 1h",
      cuisine: ["italian"],
      createdBy: "user_1",
    },
    initiatorRating: {
      initiatorOption: 4.5,
      receiverOption: 2,
    },
  },
  user_2_user_3: {
    sessionId: "user_2_user_3",
    initiatorId: "user_2",
    receiverId: "user_3",
    status: "everyone_preferences_set",
    initiatorPreferences: {
      type: "dinner",
      location: ["home cooked"],
      price: mealPriceLookup["20-30"],
      maxTime: "up to 2h",
      cuisine: ["italian"],
    },
    receiverPreferences: {
      type: "dinner",
      location: ["home cooked"],
      price: mealPriceLookup["10-20"],
      maxTime: "up to 2h",
      cuisine: ["french"],
    },
  },
};
