import { FoodEntry } from "../data/mockData";

export function isValidFoodEntry(entry: any): entry is FoodEntry {
  return (
    entry &&
    typeof entry.name === "string" &&
    typeof entry.id === "string" &&
    Array.isArray(entry.type) &&
    Array.isArray(entry.location) &&
    entry.price &&
    typeof entry.price.label === "string" &&
    typeof entry.maxTime === "string" &&
    Array.isArray(entry.cuisine)
  );
}
