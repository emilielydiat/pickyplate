import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import {
  DiningOutlined,
  PlaceOutlined,
  AccountBalanceWalletOutlined,
  AccessTime,
} from "@mui/icons-material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";
import { capitaliseWord } from "../utils/stringUtils";
import { useMealPreferencesDraftContext } from "../context/MealPreferencesDraftContext";

export function MealPreferencesConfirm() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Confirm and send");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const { draft } = useMealPreferencesDraftContext();

  if (!draft) return <Typography>Loading...</Typography>;

  console.log("draft: ", draft);

  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "calc(100vh - 176px)",
      }}
    >
      <Card sx={{ width: { xs: "100%", sm: 360 } }}>
        <CardContent
          sx={{
            p: 2,
            "&:last-child": {
              pb: 2,
            },
          }}
        >
          <Stack sx={{ flexDirection: "column", alignItems: "flex-start" }}>
            <Typography component="h3" variant="h6Branded">
              Your meal preferences
            </Typography>
            {draft.type && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
                <DiningOutlined sx={{ mr: 1 }} />
                <Typography variant="body2" color="grey.700">
                  {capitaliseWord(draft.type)}
                </Typography>
              </Box>
            )}

            {draft.location && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PlaceOutlined sx={{ mr: 1 }} />
                <Typography variant="body2" color="grey.700">
                  {draft.location.map(capitaliseWord).join(" | ")}
                </Typography>
              </Box>
            )}

            {draft.price && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccountBalanceWalletOutlined sx={{ mr: 1 }} />
                <Typography variant="body2" color="grey.700">
                  £{draft.price} per person
                </Typography>
              </Box>
            )}

            {draft.maxTime && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccessTime sx={{ mr: 1 }} />
                <Typography variant="body2" color="grey.700">
                  {capitaliseWord(draft.maxTime)}
                </Typography>
              </Box>
            )}

            {draft.cuisine && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "left",
                  gap: 1,
                }}
              >
                {draft.cuisine.map((cuisine) => (
                  <Chip key={cuisine} label={capitaliseWord(cuisine)} />
                ))}
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Box width="100%" display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>
          Confirm and send
        </Button>
      </Box>
    </Box>
  );
}
