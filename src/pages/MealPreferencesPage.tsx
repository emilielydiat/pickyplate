import { Typography } from "@mui/material";
import { MealPreferencesDraftProvider } from "../context/MealPreferencesDraftContext";
import { SharedFoodListProvider } from "../context/SharedFoodListContext";
import { useFriendData } from "../hooks/useFriendData";
import { MealPreferences } from "../components/MealPreferences";

export function MealPreferencesPage() {
  const { friend } = useFriendData();

  if (!friend) return <Typography>Loading...</Typography>;

  return (
    <SharedFoodListProvider friendId={friend.id}>
      <MealPreferencesDraftProvider>
        <MealPreferences friend={friend} />
      </MealPreferencesDraftProvider>
    </SharedFoodListProvider>
  );
}
