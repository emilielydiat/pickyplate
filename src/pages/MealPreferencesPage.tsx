import { Typography } from "@mui/material";
import { MealPreferencesDraftProvider } from "../context/MealPreferencesDraftContext";
import { useFriendData } from "../hooks/useFriendData";
import { MealPreferences } from "../components/MealPreferences";

export function MealPreferencesPage() {
  const { friend } = useFriendData();

  if (!friend) return <Typography>Loading...</Typography>;

  return (
    <MealPreferencesDraftProvider>
      <MealPreferences friend={friend} />
    </MealPreferencesDraftProvider>
  );
}
