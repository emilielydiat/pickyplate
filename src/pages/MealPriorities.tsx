import {
  Box,
  Button,
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
import { Link, useNavigate } from "react-router-dom";
import { AppDialog } from "../components/AppDialog";

type PrioritiesType = {
  name: string;
  label: string;
  displayOrder: number;
  weight: number;
};

export function MealPriorities() {
  usePageHeader("Set meal priorities", true);

  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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

  const handleSave = () => {
    const copy = Array.from(priorities);
    const updated = copy.map((item) => ({
      ...item,
      weight: 5 - item.displayOrder,
    }));

    setDialogOpen(true);
    setPriorities(updated);
    // TO DO: update DB
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate("/settings");
  };

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
      <Stack>
        <Typography variant="body2" textAlign="left">
          These are your default meal priorities. We'll use them to suggest food
          you'll enjoy most.
          <br /> <br /> If you set different priorities when deciding to eat
          together, those will override this default.
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
                role="list"
                spacing={1}
                sx={{ py: 2, px: 3, bgcolor: "primary.light" }}
              >
                {[...priorities]
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((item, index) => (
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
                          role="button"
                          aria-roledescription="draggable"
                          aria-label={`Priority: ${item.label}, position ${item.displayOrder}`}
                          sx={{ cursor: "grab", bgcolor: "#FFFFFF" }}
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
      <Box width="100%" display="flex" justifyContent="flex-end" gap={1}>
        <Button
          component={Link}
          to="/settings"
          aria-label="Go back"
          variant="outlined"
          color="primary"
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Button
          aria-label="Confirm your default meal priorities"
          variant="contained"
          color="primary"
          onClick={() => handleSave()}
          sx={{ mb: 2 }}
        >
          Save
        </Button>
      </Box>
      <AppDialog
        open={dialogOpen}
        withTextField={false}
        titleText="Meal priorities saved"
        contentText="We'll use these priorities next time you decide what to eat together. You can update them anytime!"
        primaryBtnLabel="Done"
        onClose={handleDialogClose}
        onPrimaryAction={handleDialogClose}
      />
    </Box>
  );
}
