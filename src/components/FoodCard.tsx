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
  onDelete?: (foodEntry: FoodEntry) => void;
  onEdit?: (foodEntry: FoodEntry) => void;
}

function renderActionSection(
  foodEntry: FoodEntry,
  variant: Variant,
  isAlreadyAdded?: boolean,
  onToggleAdd?: (foodEntry: FoodEntry) => void,
  onDelete?: (foodEntry: FoodEntry) => void,
  onEdit?: (foodEntry: FoodEntry) => void
) {
  switch (variant) {
    case "toAdd": {
      if (!isAlreadyAdded) {
        return (
          <Button
            aria-label={`Add ${foodEntry.name} to shared list`}
            aria-pressed={false}
            startIcon={<Add />}
            variant="outlined"
            onClick={() => onToggleAdd?.(foodEntry)}
            sx={{ width: "100%", mt: 3 }}
          >
            Add
          </Button>
        );
      } else {
        return (
          <Button
            aria-label={`Remove ${foodEntry.name} from shared list`}
            aria-pressed={true}
            startIcon={<Check />}
            variant="outlined"
            onClick={() => onToggleAdd?.(foodEntry)}
            sx={{
              width: "100%",
              color: "grey.600",
              borderColor: "grey.400",
              "&hover": { color: "grey.700", borderColor: "grey.500" },
              mt: 3,
            }}
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
    case "base":
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: 1,
            mt: 3,
          }}
        >
          <Button
            aria-label={`Delete ${foodEntry.name} from shared list`}
            startIcon={<Delete />}
            variant="outlined"
            onClick={() => onDelete?.(foodEntry)}
            sx={{ flex: 1 }}
          >
            Delete
          </Button>
          <Button
            aria-label={`Edit ${foodEntry.name} in shared list`}
            startIcon={<Edit />}
            variant="contained"
            onClick={() => onEdit?.(foodEntry)}
            sx={{ flex: 1 }}
          >
            Edit
          </Button>
        </Box>
      );
    case "short":
      return null;
    default:
      return null;
  }
}

export function FoodCard({
  variant = "short",
  foodEntry,
  isAlreadyAdded,
  onToggleAdd,
  onDelete,
  onEdit,
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
          <Typography component="h3" variant="h6Branded">
            {capitaliseWord(foodEntry.name)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
            <DiningOutlined
              aria-hidden="true"
              focusable="false"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="grey.700">
              {foodEntry.type.map(capitaliseWord).join(" | ")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PlaceOutlined
              aria-hidden="true"
              focusable="false"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="grey.700">
              {foodEntry.location.map(capitaliseWord).join(" | ")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AccountBalanceWalletOutlined
              aria-hidden="true"
              focusable="false"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="grey.700">
              {foodEntry.price.label ?? `£${foodEntry.price}`} per person
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AccessTime aria-hidden="true" focusable="false" sx={{ mr: 1 }} />
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
            }}
          >
            {foodEntry.cuisine.map((cuisine) => (
              <Chip key={cuisine} label={capitaliseWord(cuisine)} />
            ))}
          </Box>
          {renderActionSection(
            foodEntry,
            variant,
            isAlreadyAdded,
            onToggleAdd,
            onDelete,
            onEdit
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
