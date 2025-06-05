import {
  Box,
  Button,
  Chip,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useUserFoodListContext } from "../context/UserFoodListContext";
import { useFoodDraftContext } from "../context/FoodDraftContext";
import {
  FoodEntry,
  mealTypeOptions,
  mealLocationOptions,
  mealPriceOptions,
  mealMaxTimeOptions,
} from "../data/mockData";
import { capitaliseWord } from "../utils/stringUtils";

export function CreateFood() {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Create new food");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  const { draft, setDraft } = useFoodDraftContext();
  const { userFoodEntries } = useUserFoodListContext();

  const updateDraft = (field: keyof FoodEntry, value: any) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleMultiSelect = (
    field: keyof Pick<FoodEntry, "type" | "location" | "cuisine">,
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

  const isSelected = (field: keyof FoodEntry, value: string) => {
    if (!draft) return false;
    const selected = draft[field];
    return Array.isArray(selected)
      ? (selected as string[]).includes(value)
      : selected === value;
  };

  const availableCuisines = useMemo(() => {
    return Array.from(
      new Set(userFoodEntries.flatMap((entry) => entry.cuisine))
    ).sort((a, b) => a.localeCompare(b));
  }, [userFoodEntries]);

  const isFormComplete =
    !!draft?.name &&
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
            mt: 0,
            mb: 4,
          }}
        >
          {/* Food name */}
          <Typography
            component="legend"
            variant="body1"
            sx={{ textAlign: "left", mb: 1 }}
          >
            Name this food?
          </Typography>
          <TextField
            placeholder="Enter a name for your new food entry"
            label="Food name"
            variant="outlined"
            fullWidth
            value={draft.name ?? ""}
            onChange={(e) => updateDraft("name", e.target.value)}
          ></TextField>
        </FormControl>
        <FormControl
          component="fieldset"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Meal type */}
          <Typography
            component="legend"
            variant="body1"
            sx={{ textAlign: "left" }}
          >
            When can you eat this?
          </Typography>
          <Typography variant="subtitle2">(Select all that apply)</Typography>
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
                onClick={() => toggleMultiSelect("type", option)}
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
          <Typography
            component="legend"
            variant="body1"
            sx={{ textAlign: "left" }}
          >
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
            {mealLocationOptions.map((option) => (
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
          <Typography
            component="legend"
            variant="body1"
            sx={{ textAlign: "left" }}
          >
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
            {mealPriceOptions.map((option) => {
              return (
                <Chip
                  key={option.key}
                  label={option.label}
                  aria-pressed={isSelected("price", option.key)}
                  clickable
                  color={
                    isSelected("price", option.key) ? "primary" : "default"
                  }
                  onClick={() => updateDraft("price", option.key)}
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
          <Typography
            component="legend"
            variant="body1"
            sx={{ textAlign: "left" }}
          >
            How much time does it take?
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
            {mealMaxTimeOptions.map((option) => (
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
          <Typography
            component="legend"
            variant="body1"
            sx={{ textAlign: "left" }}
          >
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
            {availableCuisines.map((option) => (
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
          to={"/my-food-list/create-food/confirm"}
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
