import { Typography } from "@mui/material";
import { MealSessionProvider } from "../context/MealPreferencesContext";
import { useFriendData } from "../hooks/useFriendData";
import { MealPreferences } from "../components/MealPreferences";

export function MealPreferencesPage() {
  const { friend } = useFriendData();

  if (!friend) return <Typography>Loading...</Typography>;

  return (
    <MealSessionProvider friendId={friend.id}>
      <MealPreferences friend={friend} />
    </MealSessionProvider>
  );
}
