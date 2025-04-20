import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useFriendData } from "../hooks/useFriendData";
import { usePageTitleContext } from "../context/PageTitleContext";

export function MealPreferences() {
  const { friend } = useFriendData();
  const { setPageTitle } = usePageTitleContext();

  useEffect(() => {
    if (friend) {
      setPageTitle(`Meal preferences with ${friend.username}`);
    } else {
      setPageTitle("Meal preferences");
    }

    return () => setPageTitle(null);
  }, [friend, setPageTitle]);

  return <Typography>Meal preferences page (coming soon)</Typography>;
}
