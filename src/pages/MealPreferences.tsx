import {
  Box,
  Button,
  Chip,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useMealPreferencesDraftContext } from "../context/MealPreferencesDraftContext";
import { useSharedFoodListContext } from "../context/SharedFoodListContext";
import {
  mealTypeOptions,
  mealLocationOptionsWithAny,
  mealPriceOptionsWithAny,
  mealMaxTimeOptionsWithAny,
  MealPreferencesData,
} from "../data/mockData";
import { useFriend } from "./MealPreferencesFlowWrapper";
import { capitaliseWord } from "../utils/stringUtils";

export function MealPreferences() {
  const { friend } = useFriend();
  const { setPageTitle } = usePageTitleContext();

  useEffect(() => {
    setPageTitle(`Meal preferences with ${friend.username}`);
    return () => setPageTitle(null);
  }, [friend, setPageTitle]);

  const { draft, setDraft } = useMealPreferencesDraftContext();
  const { sharedFoodEntries } = useSharedFoodListContext();

  const updateDraft = (field: keyof MealPreferencesData, value: any) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleMultiSelect = (
    field: keyof Pick<MealPreferencesData, "location" | "cuisine">,
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

  const availableCuisines = useMemo(() => {
    return Array.from(
      new Set(sharedFoodEntries.flatMap((entry) => entry.cuisine))
    ).sort((a, b) => a.localeCompare(b));
  }, [sharedFoodEntries]);

  const availableCuisinesWithAny = [...availableCuisines, "any"];

  const isFormComplete =
    !!draft?.type &&
    Array.isArray(draft.location) &&
    draft.location.length > 0 &&
    !!draft?.price &&
    !!draft?.maxTime &&
    Array.isArray(draft.cuisine) &&
    draft.cuisine.length > 0;

  return (
    <Box component="section">
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
          <Typography component="legend" variant="body1">
            What meal are you eating?
          </Typography>
          <Stack
            role="group"
            aria-label="Meal type"
            direction="row"
            mt={1}
            flexWrap="wrap"
          >
            {mealTypeOptions.map((option) => (
              <Chip
                key={option}
                label={capitaliseWord(option)}
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
          <Typography component="legend" variant="body1">
            Where are you eating?
          </Typography>
          <Typography variant="subtitle2">(Select all that apply)</Typography>
          <Stack
            role="group"
            aria-label="Meal location"
            direction="row"
            mt={1}
            flexWrap="wrap"
          >
            {mealLocationOptionsWithAny.map((option) => (
              <Chip
                key={option}
                label={capitaliseWord(option)}
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
          <Typography component="legend" variant="body1">
            How much per person?
          </Typography>
          <Typography variant="subtitle2">
            Including beverage, dessert, etc.
          </Typography>
          <Stack
            role="group"
            aria-label="Meal price per person"
            direction="row"
            mt={1}
            flexWrap="wrap"
          >
            {mealPriceOptionsWithAny.map((option) => {
              return (
                <Chip
                  key={option.key}
                  label={option.label}
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
          <Typography component="legend" variant="body1">
            How much time can you afford?
          </Typography>
          <Typography variant="subtitle2">
            Including travel, preparation and dining time
          </Typography>
          <Stack
            role="group"
            aria-label="Max amount of time you can afford for your meal"
            direction="row"
            mt={1}
            flexWrap="wrap"
          >
            {mealMaxTimeOptionsWithAny.map((option) => (
              <Chip
                key={option}
                label={capitaliseWord(option)}
                aria-pressed={isSelected("maxTime", option)}
                clickable
                color={isSelected("maxTime", option) ? "primary" : "default"}
                onClick={() => updateDraft("maxTime", option)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </FormControl>
        {/* Cuisines */}
        <FormControl
          component="fieldset"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mt: 4,
          }}
        >
          <Typography component="legend" variant="body1">
            What cuisine?
          </Typography>
          <Typography variant="subtitle2">(Select all that apply)</Typography>
          <Stack
            role="group"
            aria-label="Cuisines you're interested in for your meal"
            direction="row"
            mt={1}
            flexWrap="wrap"
          >
            {availableCuisinesWithAny.map((option) => (
              <Chip
                key={option}
                label={capitaliseWord(option)}
                aria-pressed={isSelected("cuisine", option)}
                clickable
                color={isSelected("cuisine", option) ? "primary" : "default"}
                onClick={() => toggleMultiSelect("cuisine", option)}
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
          sx={{ mb: 2 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
