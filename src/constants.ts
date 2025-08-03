import { Meal, MealLocation, MealMaxTime, MealPriceRange } from "./types";

export const mealLabelMap: Record<Meal, string> = {
  [Meal.Breakfast]: "Breakfast",
  [Meal.Lunch]: "Lunch",
  [Meal.Dinner]: "Dinner",
};

export const mealMaxTimeLabelMap: Record<MealMaxTime, string> = {
  [MealMaxTime.OneHour]: "Up to 1h",
  [MealMaxTime.TwoHours]: "Up to 2h",
  [MealMaxTime.ThreeHours]: "Up to 3h",
  [MealMaxTime.ThreeHoursPlus]: "3h +",
};

export const mealPriceRangeLabelMap: Record<MealPriceRange, string> = {
  [MealPriceRange.OneToTen]: "£1-10",
  [MealPriceRange.TenToTwenty]: "£10-20",
  [MealPriceRange.TwentyToThirty]: "£20-30",
  [MealPriceRange.ThirtyToForty]: "£30-40",
  [MealPriceRange.FortyToFifty]: "£40-50",
  [MealPriceRange.FiftyToSixty]: "£50-60",
  [MealPriceRange.SixtyToSeventy]: "£60-70",
  [MealPriceRange.SeventyPlus]: "£70+",
};

export const mealLocationLabelMap: Record<MealLocation, string> = {
  [MealLocation.DineIn]: "Dine in",
  [MealLocation.DeliveryOrTakeOut]: "Delivery/take out",
  [MealLocation.HomeCooked]: "Home cooked",
};
