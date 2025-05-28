import {
  Box,
  Button,
  Chip,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useMealPreferencesDraftContext } from "../context/MealPreferencesDraftContext";
import {
  mealTypeOptions,
  mealLocationOptionsWithAny,
  mealPriceOptionsWithAny,
  mealMaxTimeOptionsWithAny,
  MealPreferencesData,
  User,
} from "../data/mockData";

interface MealPreferencesProps {
  friend: User;
}

export function MealPreferences({ friend }: MealPreferencesProps) {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle(`Meal preferences with ${friend.username}`);
    return () => setPageTitle(null);
  }, [friend, setPageTitle]);

  const { draft, setDraft } = useMealPreferencesDraftContext();

  const updateDraft = (field: keyof MealPreferencesData, value: any) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleMultiSelect = (
    field: keyof Pick<MealPreferencesData, "location">,
    value: string
  ) => {
    if (!draft) return;

    const current = (draft[field] ?? []) as string[];

    if (value === "any") {
      updateDraft(field, ["any"]);
    } else {
      const filtered = current.filter((v) => v !== "any");
      const updated = current.includes(value)
        ? filtered.filter((v) => v !== value)
        : [...filtered, value];
      updateDraft(field, updated);
    }
  };

  const isSelected = (field: keyof MealPreferencesData, value: any) => {
    if (!draft) return false;
    const selected = draft[field];
    return Array.isArray(selected)
      ? selected.includes(value)
      : selected === value;
  };

  const isFormComplete =
    !!draft?.type &&
    Array.isArray(draft.location) &&
    draft.location.length > 0 &&
    !!draft?.price &&
    !!draft?.maxTime;

  return (
    <Box>
      <Stack sx={{ width: "100%", flexDirection: "column" }}>
        <FormControl
          component="fieldset"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Meal type */}
          <Typography variant="body1">When are you eating?</Typography>
          <Stack direction="row" mt={1} flexWrap="wrap">
            {mealTypeOptions.map((option) => (
              <Chip
                key={option}
                label={option}
                aria-pressed={isSelected("type", option)}
                clickable
                color={isSelected("type", option) ? "primary" : "default"}
                onClick={() => updateDraft("type", option)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </FormControl>
        {/* Location */}
        <FormControl
          component="fieldset"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mt: 4,
          }}
        >
          <Typography variant="body1">Where are you eating?</Typography>
          <Stack direction="row" mt={1} flexWrap="wrap">
            {mealLocationOptionsWithAny.map((option) => (
              <Chip
                key={option}
                label={option}
                aria-pressed={isSelected("location", option)}
                clickable
                color={isSelected("location", option) ? "primary" : "default"}
                onClick={() => toggleMultiSelect("location", option)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </FormControl>
        {/* Price */}
        <FormControl
          component="fieldset"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mt: 4,
          }}
        >
          <Typography variant="body1">How much per person?</Typography>
          <Stack direction="row" mt={1} flexWrap="wrap">
            {mealPriceOptionsWithAny.map((option) => {
              return (
                <Chip
                  key={option === "any" ? "any" : option.key}
                  label={option === "any" ? "any" : option.label}
                  aria-pressed={isSelected("price", option)}
                  clickable
                  color={isSelected("price", option) ? "primary" : "default"}
                  onClick={() => updateDraft("price", option)}
                  sx={{ m: 0.5 }}
                />
              );
            })}
          </Stack>
        </FormControl>
        {/* Max time */}
        <FormControl
          component="fieldset"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mt: 4,
          }}
        >
          <Typography variant="body1">How much time can you afford?</Typography>
          <Stack direction="row" mt={1} flexWrap="wrap">
            {mealMaxTimeOptionsWithAny.map((option) => (
              <Chip
                key={option}
                label={option}
                aria-pressed={isSelected("maxTime", option)}
                clickable
                color={isSelected("maxTime", option) ? "primary" : "default"}
                onClick={() => updateDraft("maxTime", option)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </FormControl>
      </Stack>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button
          component={Link}
          to={`/eat-together/${friend.id}/meal-preferences/confirm`}
          variant="contained"
          color="primary"
          disabled={!isFormComplete}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
