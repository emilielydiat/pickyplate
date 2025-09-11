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
import { useState } from "react";
import { usePageHeader } from "../hooks/usePageHeader";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

type PrioritiesType = {
  name: string;
  label: string;
  displayOrder: number;
  weight: number;
};

export function MealPriorities() {
  usePageHeader("Set meal priorities", true);

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

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    console.log(result);
    if (!destination || destination.index === source.index) return;

    const copy = Array.from(priorities);
    const [movedItem] = copy.splice(source.index, 1);
    copy.splice(destination.index, 0, movedItem);

    const updated = copy.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));

    setPriorities(updated);
  };

  console.log("priorities on load: ", priorities);

  return (
    <Box>
      <Stack>
        <Typography variant="body2" textAlign="left">
          These are your default meal priorities. We'll use them to suggest food
          you'll enjoy most. You can change them anytime. <br /> <br /> If you
          set different priorities when deciding to eat together, those will
          override this default.
        </Typography>
        <Typography variant="body2" textAlign="left" pt={5} pb={1}>
          Drag to rank from most (1) to least (4) important:
        </Typography>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="priorities">
            {(droppableProvider) => (
              <List
                {...droppableProvider.droppableProps}
                ref={droppableProvider.innerRef}
                component={Stack}
                spacing={1}
                sx={{ py: 2, px: 3, bgcolor: "primary.light" }}
              >
                {priorities.map((item, index) => (
                  <Draggable
                    key={item.name}
                    draggableId={item.name}
                    index={index}
                  >
                    {(draggableProvider) => (
                      <ListItem
                        ref={draggableProvider.innerRef}
                        {...draggableProvider.draggableProps}
                        {...draggableProvider.dragHandleProps}
                        sx={{ bgcolor: "#FFFFFF" }}
                      >
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
                    )}
                  </Draggable>
                ))}
                {droppableProvider.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Stack>
    </Box>
  );
}
