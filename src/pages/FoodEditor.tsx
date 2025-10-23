import {
  Box,
  Button,
  Chip,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { capitaliseWord } from "../utils/stringUtils";
import { AppDialog } from "../components/AppDialog";
import { usePageHeader } from "../hooks/usePageHeader";
import {
  mealLabelMap,
  mealLocationLabelMap,
  mealMaxTimeLabelMap,
  mealPriceRangeLabelMap,
} from "../constants";
import {
  FoodEntry,
  Meal,
  MealLocation,
  MealMaxTime,
  MealPriceRange,
} from "../types";
import {
  addFoodEntry,
  addFoodEntryToSharedList,
  editFoodEntry,
  getCuisines,
  getFoodEntryById,
} from "../api/api";
import { useUserContext } from "../context/UserContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDialogManager } from "../hooks/useDialogManager";

export function FoodEditor() {
  const { foodId } = useParams();

  const isEditing = foodId !== undefined;

  usePageHeader(isEditing ? "Edit food" : "Create new food", true);

  const { id } = useUserContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { dialogOpen, dialogConfig, openDialog, closeDialog } =
    useDialogManager();

  const [foodName, setFoodName] = useState("");
  const [mealTypes, setMealTypes] = useState<Meal[]>([]);
  const [mealLocations, setMealLocations] = useState<MealLocation[]>([]);
  const [mealPriceRange, setMealPriceRange] = useState<MealPriceRange | null>(
    null
  );
  const [mealMaxTime, setMealMaxTime] = useState<MealMaxTime | null>(null);
  const [cuisines, setCuisines] = useState<string[]>([]);

  const isValid =
    Boolean(foodName) &&
    Boolean(mealPriceRange) &&
    Boolean(mealMaxTime) &&
    mealTypes.length > 0 &&
    mealLocations.length > 0 &&
    cuisines.length > 0;

  const [newCuisineError, setNewCuisineError] = useState<string>("");
  const [newCuisine, setNewCuisine] = useState<string>("");
  const newCuisineRef = useRef<string>("");

  const mealTypeOptions = Object.values(Meal).map<[string, Meal]>((value) => [
    mealLabelMap[value],
    value,
  ]);

  const mealLocationOptions = Object.values(MealLocation).map<
    [string, MealLocation]
  >((value) => [mealLocationLabelMap[value], value]);

  const mealPriceOptions = Object.values(MealPriceRange).map<
    [string, MealPriceRange]
  >((value) => [mealPriceRangeLabelMap[value], value]);

  const mealMaxTimeOptions = Object.values(MealMaxTime).map<
    [string, MealMaxTime]
  >((value) => [mealMaxTimeLabelMap[value], value]);

  const [availableCuisines, setAvailableCuisines] = useState<string[]>([]);

  const handleNewCuisineClick = () => {
    setNewCuisine("");
    setNewCuisineError("");
    openDialog({
      titleText: "Add new cuisine",
      primaryBtnLabel: "Confirm",
      onPrimaryAction: handleDialogConfirm,
      secondaryBtnLabel: "Cancel",
      onSecondaryAction: closeDialog,
    });
  };

  const handleNewCuisineChange = (value: string) => {
    setNewCuisineError("");
    setNewCuisine(value);
    newCuisineRef.current = value;
  };

  const handleDialogConfirm = () => {
    const cleaned = newCuisineRef.current.trim().toLowerCase();

    if (availableCuisines.includes(cleaned)) {
      setNewCuisineError("Cuisine already exists");
      return;
    } else {
      setNewCuisineError("");
    }

    setAvailableCuisines((prev) => [...new Set([...prev, cleaned])]);
    setCuisines((prev) => [...prev, cleaned]);

    closeDialog();
  };

  const handleSubmit = async () => {
    const shareWith = searchParams.get("share");
    const entry: FoodEntry = {
      name: foodName,
      meals: mealTypes,
      meal_locations: mealLocations,
      meal_price_range: mealPriceRange!,
      meal_max_time: mealMaxTime!,
      cuisines,
    };

    // If foodId is provided, update the existing entry; otherwise, create a new one
    if (isEditing) {
      await editFoodEntry(foodId, entry);
    } else {
      const newEntry = await addFoodEntry(id, entry);

      // If shareWith is provided, add the new entry to the shared list
      if (shareWith) {
        await addFoodEntryToSharedList(id, shareWith, newEntry.id!);
      }
    }

    navigate(
      shareWith ? `/friend/${shareWith}/shared-food-list` : "/my-food-list"
    );
  };

  useEffect(() => {
    // If foodId is provided, fetch the food entry details from the server
    if (foodId) {
      (async () => {
        const result = await getFoodEntryById(foodId);
        setFoodName(result.name);
        setMealTypes(result.meals);
        setMealLocations(result.meal_locations);
        setMealPriceRange(result.meal_price_range);
        setMealMaxTime(result.meal_max_time);
        setCuisines(result.cuisines);
        setAvailableCuisines((prev) => [
          ...new Set([...prev, ...result.cuisines]),
        ]);
      })();
    }
  }, [foodId]);

  useEffect(() => {
    (async () => {
      const result = await getCuisines();
      setAvailableCuisines((prev) => [...new Set([...prev, ...result])]);
    })();
  }, []);

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
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
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
            {mealTypeOptions.map(([label, value]) => (
              <Chip
                key={value}
                label={capitaliseWord(label)}
                aria-pressed={mealTypes.includes(value)}
                clickable
                color={mealTypes.includes(value) ? "primary" : "default"}
                onClick={() =>
                  setMealTypes((prev) =>
                    prev.includes(value)
                      ? prev.filter((v) => v !== value)
                      : [...prev, value]
                  )
                }
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
            {mealLocationOptions.map(([label, value]) => (
              <Chip
                key={value}
                label={capitaliseWord(label)}
                aria-pressed={mealLocations.includes(value)}
                clickable
                color={mealLocations.includes(value) ? "primary" : "default"}
                onClick={() =>
                  setMealLocations((prev) =>
                    prev.includes(value)
                      ? prev.filter((v) => v !== value)
                      : [...prev, value]
                  )
                }
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
            {mealPriceOptions.map(([label, value]) => {
              return (
                <Chip
                  key={value}
                  label={label}
                  aria-pressed={mealPriceRange === value}
                  clickable
                  color={mealPriceRange === value ? "primary" : "default"}
                  onClick={() => setMealPriceRange(value)}
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
            {mealMaxTimeOptions.map(([label, value]) => (
              <Chip
                key={value}
                label={capitaliseWord(label)}
                aria-pressed={mealMaxTime === value}
                clickable
                color={mealMaxTime === value ? "primary" : "default"}
                onClick={() => setMealMaxTime(value)}
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
                aria-pressed={cuisines.includes(option)}
                clickable
                color={cuisines.includes(option) ? "primary" : "default"}
                onClick={() =>
                  setCuisines((prev) =>
                    prev.includes(option)
                      ? prev.filter((v) => v !== option)
                      : [...prev, option]
                  )
                }
                sx={{ m: 0.5 }}
              />
            ))}
            <Chip
              label="+ New"
              variant="outlined"
              clickable
              onClick={handleNewCuisineClick}
              sx={{ m: 0.5 }}
            />
          </Stack>
        </FormControl>
      </Stack>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          type="button"
          sx={{ mb: 2 }}
          disabled={!isValid}
        >
          Save
        </Button>
      </Box>

      <AppDialog
        open={dialogOpen}
        withTextField={true}
        titleText={dialogConfig.titleText}
        contentText={dialogConfig.contentText}
        onClose={closeDialog}
        primaryBtnLabel={dialogConfig.primaryBtnLabel}
        onPrimaryAction={dialogConfig.onPrimaryAction}
        secondaryBtnLabel={dialogConfig.secondaryBtnLabel}
        onSecondaryAction={dialogConfig.onSecondaryAction}
        textFieldLabel="Cuisine name"
        textFieldValue={newCuisine}
        textFieldError={!!newCuisineError}
        textFieldHelperText={newCuisineError}
        onTextFieldChange={handleNewCuisineChange}
      />
    </Box>
  );
}
