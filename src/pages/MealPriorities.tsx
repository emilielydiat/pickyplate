import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { DragIndicator } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { usePageHeader } from "../hooks/usePageHeader";

type PrioritiesType = {
  name: string;
  label: string;
  displayOrder: number;
  weight: number;
};

export function MealPriorities() {
  usePageHeader("Set meal priorities", true);

  // store locally priorities & ranking
  const [priorities, setPriorities] = useState<PrioritiesType[]>([
    {
      name: "location",
      label: "Location",
      displayOrder: 1,
      weight: 1,
    },
    {
      name: "price",
      label: "Price",
      displayOrder: 2,
      weight: 1,
    },
    {
      name: "time",
      label: "Time required",
      displayOrder: 3,
      weight: 1,
    },
    {
      name: "cuisine",
      label: "Cuisine type",
      displayOrder: 4,
      weight: 1,
    },
  ]);

  const sortedPriorities = useMemo(
    () => [...priorities].sort((a, b) => a.displayOrder - b.displayOrder),
    [priorities]
  );

  // TO DO: send priorities to DB

  return (
    <Box>
      <Stack>
        <Typography variant="body2" textAlign="left">
          These are your default meal priorities. We’ll use them to suggest food
          you’ll enjoy most. You can change them anytime. <br /> <br /> If you
          set different priorities when deciding to eat together, those will
          override this default.
        </Typography>
        <Typography variant="body2" textAlign="left" pt={5} pb={1}>
          Drag to rank from most (1) to least (4) important:
        </Typography>
        <List
          component={Stack}
          spacing={1}
          sx={{ py: 2, px: 3, bgcolor: "primary.light" }}
        >
          {sortedPriorities.map((item) => (
            <ListItem key={item.name} sx={{ bgcolor: "#FFFFFF" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  height: "24px",
                  width: "24px",
                  mr: 1,
                  bgcolor: "#F9DAD2",
                }}
              >
                {item.displayOrder}
              </Box>
              <ListItemText primary={item.label} />
              <ListItemIcon sx={{ minWidth: 3 }}>
                <DragIndicator />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Box>
  );
}
