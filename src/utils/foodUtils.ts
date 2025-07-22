export function isFoodEntryUsedInSharedLists(
  userId: string,
  foodEntryId: string,
  sharedFoodLists: Record<string, string[]>
): boolean {
  return Object.entries(sharedFoodLists)
    .filter(([key]) => key.includes(userId))
    .some(([, foodIds]) => foodIds.includes(foodEntryId));
}
