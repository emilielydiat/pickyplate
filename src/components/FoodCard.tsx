// TO DO: variants
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  Button,
} from "@mui/material";
import {
  DiningOutlined,
  PlaceOutlined,
  AccountBalanceWalletOutlined,
  AccessTime,
  Delete,
  Edit,
  Add,
  Check,
} from "@mui/icons-material";
import { FoodEntry } from "../data/mockData";
import { capitaliseWord } from "../utils/stringUtils";

type Variant =
  | "base"
  | "short"
  | "toAdd"
  | "unrated"
  | "ratedLost"
  | "ratedWon";

interface FoodCardProps {
  foodEntry: FoodEntry;
  variant?: Variant;
  isAlreadyAdded?: boolean;
  onToggleAdd?: (foodEntry: FoodEntry) => void;
}

function renderActionSection(
  foodEntry: FoodEntry,
  variant: Variant,
  isAlreadyAdded?: boolean,
  onToggleAdd?: (foodEntry: FoodEntry) => void
) {
  switch (variant) {
    case "toAdd": {
      if (!isAlreadyAdded) {
        return (
          <Button
            sx={{ width: "100%" }}
            variant="outlined"
            startIcon={<Add />}
            onClick={() => onToggleAdd?.(foodEntry)}
          >
            Add
          </Button>
        );
      } else {
        return (
          <Button
            sx={{
              width: "100%",
              color: "grey.600",
              borderColor: "grey.400",
              "&hover": { color: "grey.700", borderColor: "grey.500" },
            }}
            variant="outlined"
            startIcon={<Check />}
            onClick={() => onToggleAdd?.(foodEntry)}
          >
            Added
          </Button>
        );
      }
    }
    case "unrated":
      return <></>;
    case "ratedLost":
      return <></>;
    case "ratedWon":
      return <></>;
    case "short":
      return null;
    default:
      return (
        <Box sx={{ display: "flex", direction: "row", width: "100%", gap: 1 }}>
          <Button sx={{ flex: 1 }} variant="outlined" startIcon={<Delete />}>
            Delete
          </Button>
          <Button sx={{ flex: 1 }} variant="contained" startIcon={<Edit />}>
            Edit
          </Button>
        </Box>
      );
  }
}

export function FoodCard({
  variant = "base",
  foodEntry,
  isAlreadyAdded,
  onToggleAdd,
}: FoodCardProps) {
  return (
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
          <Typography variant="h6Branded">
            {capitaliseWord(foodEntry.name)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
            <DiningOutlined sx={{ mr: 1 }} />
            <Typography variant="body2" color="grey.700">
              {foodEntry.type.map(capitaliseWord).join(" | ")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PlaceOutlined sx={{ mr: 1 }} />
            <Typography variant="body2" color="grey.700">
              {foodEntry.location.map(capitaliseWord).join(" | ")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AccountBalanceWalletOutlined sx={{ mr: 1 }} />
            <Typography variant="body2" color="grey.700">
              £{foodEntry.price.min}-{foodEntry.price.max} per person
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AccessTime sx={{ mr: 1 }} />
            <Typography variant="body2" color="grey.700">
              {capitaliseWord(foodEntry.maxTime)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "left",
              gap: 1,
              mb: 3,
            }}
          >
            {foodEntry.cuisine.map((cuisine) => (
              <Chip key={cuisine} label={capitaliseWord(cuisine)} />
            ))}
          </Box>
          {renderActionSection(foodEntry, variant, isAlreadyAdded, onToggleAdd)}
        </Stack>
      </CardContent>
    </Card>
  );
}
