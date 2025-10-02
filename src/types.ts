export type User = {
  id: string;
  created_at: number;
  name: string;
  email: string;
  avatar: string;
};

// Different naming convention used here to match database column names for convenience
export type FriendRequest = {
  initiator_id: string;
  target_id: string;
};

// Different naming convention used here to match database column names for convenience
export type FoodEntry = {
  id?: string;
  user_id?: string;
  name: string;
  meals: Meal[];
  meal_locations: MealLocation[];
  meal_price_range: MealPriceRange;
  meal_max_time: MealMaxTime;
  cuisines: string[];
};

export type MealSessionPreferences = {
  meal: Meal;
  meal_locations: MealLocation[] | "any";
  meal_price_range: MealPriceRange | "any";
  meal_max_time: MealMaxTime | "any";
  cuisines: string[] | "any";
  meal_priorities_weights: MealPrioritiesWeights;
};

export type MealSession = {
  initiator_id: string;
  friend_id: string;
  preferences_1: MealSessionPreferences | null;
  preferences_2: MealSessionPreferences | null;
  food_1: string | null;
  food_2: string | null;
  rating_1_food_1: number | null;
  rating_1_food_2: number | null;
  rating_2_food_1: number | null;
  rating_2_food_2: number | null;
};

export enum MealSessionStage {
  NotStarted,
  AwaitingPreferencesFromBoth,
  AwaitingPreferencesFromCurrentUser,
  AwaitingPreferencesFromFriend,
  AwaitingRatingFromBoth,
  AwaitingRatingFromCurrentUser,
  AwaitingRatingFromFriend,
  Completed,
}

// Must match the enums on Supabase
export enum Meal {
  Breakfast = "breakfast",
  Lunch = "lunch",
  Dinner = "dinner",
}

// Must match the enums on Supabase
export enum MealMaxTime {
  OneHour = "1h",
  TwoHours = "2h",
  ThreeHours = "3h",
  ThreeHoursPlus = "3h+",
}

// Must match the enums on Supabase
export enum MealPriceRange {
  OneToTen = "1-10",
  TenToTwenty = "10-20",
  TwentyToThirty = "20-30",
  ThirtyToForty = "30-40",
  FortyToFifty = "40-50",
  FiftyToSixty = "50-60",
  SixtyToSeventy = "60-70",
  SeventyPlus = "70+",
}

// Must match the enums on Supabase
export enum MealLocation {
  DineIn = "dine_in",
  DeliveryOrTakeOut = "delivery_or_take_out",
  HomeCooked = "home_cooked",
}

export type PrioritiesType = {
  name: string;
  label: string;
  displayOrder: number;
  weight: number;
};

export type MealPrioritiesWeights = {
  location: number;
  price: number;
  time: number;
  cuisines: number;
};

export type DialogConfig = {
  titleText: string;
  contentText: string | React.ReactNode;
  primaryBtnLabel: string;
  secondaryBtnLabel?: string;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
};
