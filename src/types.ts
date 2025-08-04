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
