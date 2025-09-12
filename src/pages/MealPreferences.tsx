import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { capitaliseWord } from "../utils/stringUtils";
import { usePageHeader } from "../hooks/usePageHeader";
import {
  Meal,
  MealLocation,
  MealMaxTime,
  MealPriceRange,
  MealSessionStage,
  User,
} from "../types";
import {
  mealLabelMap,
  mealLocationLabelMap,
  mealMaxTimeLabelMap,
  mealPriceRangeLabelMap,
} from "../constants";
import {
  AccessTime,
  AccountBalanceWalletOutlined,
  DiningOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { AppDialog } from "../components/AppDialog";
import { useNavigate } from "react-router-dom";
import { submitMealSessionPreferences } from "../api/api";
import { EatTogetherContext } from "../context/EatTogetherContext";
import { getMealSessionStage } from "../utils/mealSession";
import { useUserContext } from "../context/UserContext";

type DialogConfig = {
  titleText: string;
  contentText: string | React.ReactNode;
  primaryBtnLabel: string;
  onPrimaryAction: () => void;
};

function PreferencesReview(props: {
  friend: User;
  meal: Meal;
  locations: MealLocation[] | "any";
  priceRange: MealPriceRange | "any";
  maxTime: MealMaxTime | "any";
  cuisines: string[] | "any";
  onSubmit: () => void;
}) {
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
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
              <DiningOutlined
                aria-hidden="true"
                focusable="false"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="grey.700">
                {capitaliseWord(props.meal)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PlaceOutlined
                aria-hidden="true"
                focusable="false"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="grey.700">
                {props.locations === "any"
                  ? "Any"
                  : props.locations
                      .map((l) => mealLocationLabelMap[l])
                      .join(" | ")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <AccountBalanceWalletOutlined
                aria-hidden="true"
                focusable="false"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="grey.700">
                {props.priceRange === "any"
                  ? "Any"
                  : mealPriceRangeLabelMap[props.priceRange]}{" "}
                per person
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <AccessTime aria-hidden="true" focusable="false" sx={{ mr: 1 }} />
              <Typography variant="body2" color="grey.700">
                {props.maxTime === "any"
                  ? "Any"
                  : mealMaxTimeLabelMap[props.maxTime]}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "left",
                gap: 1,
              }}
            >
              {props.cuisines === "any"
                ? "Any cuisine"
                : props.cuisines.map((cuisine) => (
                    <Chip key={cuisine} label={capitaliseWord(cuisine)} />
                  ))}
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Box width="100%" display="flex" justifyContent="flex-end">
        <Button
          aria-label={`Confirm your meal preferences for meal with ${props.friend.name}`}
          variant="contained"
          color="primary"
          onClick={props.onSubmit}
          sx={{ mb: 2 }}
        >
          Confirm and send
        </Button>
      </Box>
    </Box>
  );
}

export function MealPreferences() {
  const navigate = useNavigate();

  const { id } = useUserContext();
  const { friend, sharedFoodList, reloadSession } =
    useContext(EatTogetherContext)!;

  const [mealType, setMealType] = useState<Meal | null>(null);
  const [mealLocations, setMealLocations] = useState<
    MealLocation[] | "any" | null
  >(null);
  const [mealPriceRange, setMealPriceRange] = useState<
    MealPriceRange | "any" | null
  >(null);
  const [mealMaxTime, setMealMaxTime] = useState<MealMaxTime | "any" | null>(
    null,
  );
  const [mealCuisines, setMealCuisines] = useState<string[] | "any" | null>(
    null,
  );
  const [isReviewing, setIsReviewing] = useState(false);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    titleText: "",
    contentText: "",
    primaryBtnLabel: "",
    onPrimaryAction: () => {},
  });

  usePageHeader(`Meal preferences with ${friend.name}`, true);

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

  const cuisineOptions = useMemo(() => {
    const cuisineList = new Set<string>();

    sharedFoodList.forEach((food) =>
      food.cuisines.forEach((c) => cuisineList.add(c)),
    );

    return [...cuisineList];
  }, [sharedFoodList]);

  const isFormValid = useMemo(() => {
    return (
      mealType &&
      mealMaxTime &&
      mealPriceRange &&
      (Array.isArray(mealLocations)
        ? mealLocations.length > 0
        : mealLocations === "any") &&
      (Array.isArray(mealCuisines)
        ? mealCuisines.length > 0
        : mealCuisines === "any")
    );
  }, [mealType, mealLocations, mealPriceRange, mealMaxTime, mealCuisines]);

  const handleSubmit = async () => {
    const updatedSession = await submitMealSessionPreferences(friend.id, {
      meal: mealType!,
      meal_locations: mealLocations!,
      meal_price_range: mealPriceRange!,
      meal_max_time: mealMaxTime!,
      cuisines: mealCuisines!,
    });

    const sessionStatus = getMealSessionStage(id, updatedSession);

    if (sessionStatus === MealSessionStage.AwaitingPreferencesFromFriend) {
      setDialogConfig({
        titleText: "Meal invitation sent",
        contentText: (
          <>
            Your friend will receive the invite to eat together. <br />
            <br /> Check the “Decide what to eat together” section in your
            Requests menu for updates.
          </>
        ),
        primaryBtnLabel: "Go to requests menu",
        onPrimaryAction: () => {
          setDialogOpen(false);
          navigate("/requests");
        },
      });
      setDialogOpen(true);
    } else {
      void reloadSession();
    }
  };

  if (isReviewing) {
    return (
      <>
        <PreferencesReview
          friend={friend}
          meal={mealType!}
          locations={mealLocations!}
          priceRange={mealPriceRange!}
          maxTime={mealMaxTime!}
          cuisines={mealCuisines!}
          onSubmit={handleSubmit}
        />

        <AppDialog
          open={dialogOpen}
          withTextField={false}
          titleText={dialogConfig.titleText}
          contentText={dialogConfig.contentText}
          primaryBtnLabel={dialogConfig.primaryBtnLabel}
          onClose={dialogConfig.onPrimaryAction}
          onPrimaryAction={dialogConfig.onPrimaryAction}
        />
      </>
    );
  }

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
          <Typography
            component="legend"
            variant="body1"
            sx={{ textAlign: "left" }}
          >
            What meal are you eating?
          </Typography>
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
                aria-pressed={mealType === value}
                clickable
                color={mealType === value ? "primary" : "default"}
                onClick={() => setMealType(value)}
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
                aria-pressed={
                  Array.isArray(mealLocations) && mealLocations.includes(value)
                }
                clickable
                color={
                  Array.isArray(mealLocations) && mealLocations.includes(value)
                    ? "primary"
                    : "default"
                }
                onClick={() => {
                  setMealLocations((prev) => {
                    if (!Array.isArray(prev)) return [value];
                    if (prev.includes(value)) {
                      return prev.filter((c) => c !== value);
                    } else {
                      return [...prev, value];
                    }
                  });
                }}
                sx={{ m: 0.5 }}
              />
            ))}
            <Chip
              label="Any"
              aria-pressed={mealLocations === "any"}
              clickable
              color={mealLocations === "any" ? "primary" : "default"}
              onClick={() => setMealLocations("any")}
              sx={{ m: 0.5 }}
            />
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
            {mealPriceOptions.map(([label, value]) => (
              <Chip
                key={value}
                label={capitaliseWord(label)}
                aria-pressed={mealPriceRange === value}
                clickable
                color={mealPriceRange === value ? "primary" : "default"}
                onClick={() => setMealPriceRange(value)}
                sx={{ m: 0.5 }}
              />
            ))}

            <Chip
              label="Any"
              aria-pressed={mealPriceRange === "any"}
              clickable
              color={mealPriceRange === "any" ? "primary" : "default"}
              onClick={() => setMealPriceRange("any")}
              sx={{ m: 0.5 }}
            />
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

            <Chip
              label="Any"
              aria-pressed={mealMaxTime === "any"}
              clickable
              color={mealMaxTime === "any" ? "primary" : "default"}
              onClick={() => setMealMaxTime("any")}
              sx={{ m: 0.5 }}
            />
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
            {cuisineOptions.map((cuisine) => (
              <Chip
                key={cuisine}
                label={capitaliseWord(cuisine)}
                aria-pressed={
                  Array.isArray(mealCuisines) && mealCuisines.includes(cuisine)
                }
                clickable
                color={
                  Array.isArray(mealCuisines) && mealCuisines.includes(cuisine)
                    ? "primary"
                    : "default"
                }
                onClick={() => {
                  setMealCuisines((prev) => {
                    if (!Array.isArray(prev)) return [cuisine];
                    if (prev.includes(cuisine)) {
                      return prev.filter((c) => c !== cuisine);
                    } else {
                      return [...prev, cuisine];
                    }
                  });
                }}
                sx={{ m: 0.5 }}
              />
            ))}
            <Chip
              label="Any"
              aria-pressed={mealCuisines === "any"}
              clickable
              color={mealCuisines === "any" ? "primary" : "default"}
              onClick={() => setMealCuisines("any")}
              sx={{ m: 0.5 }}
            />
          </Stack>
        </FormControl>
      </Stack>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!isFormValid}
          sx={{ mb: 2 }}
          onClick={() => setIsReviewing(true)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
