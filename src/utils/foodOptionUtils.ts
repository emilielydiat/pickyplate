import { FoodEntry, MealPreferencesData, MealLocation } from "../data/mockData";
import { arraysHaveCommonItems } from "./arrayUtils";

export function matchFoodToPreferences(
  sharedFoodList: FoodEntry[],
  preferences: MealPreferencesData
): FoodEntry | null {
  const matchingOptions = sharedFoodList.filter((food) => {
    const typeMatch: boolean = food.type.includes(preferences.type);

    const locationMatch: boolean =
      preferences.location.includes("any") ||
      arraysHaveCommonItems(
        food.location,
        preferences.location as MealLocation[]
      );

    const priceMatch: boolean =
      preferences.price.key === "any" ||
      (food.price.min >= preferences.price.min &&
        food.price.max <= preferences.price.max);

    const timeMatch: boolean =
      preferences.maxTime.includes("any") ||
      food.maxTime === preferences.maxTime;

    const cuisineMatch: boolean =
      preferences.cuisine.includes("any") ||
      arraysHaveCommonItems(food.cuisine, preferences.cuisine);

    return (
      typeMatch && locationMatch && priceMatch && timeMatch && cuisineMatch
    );
  });

  if (matchingOptions.length > 0) {
    const randomIndex = Math.floor(Math.random() * matchingOptions.length);
    return matchingOptions[randomIndex];
  }

  return null;
}
