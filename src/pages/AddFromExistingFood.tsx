import { Box, Stack, Typography } from "@mui/material";
import { useUserContext } from "../context/UserContext";
import {
  addFoodEntryToSharedList,
  getFoodList,
  getSharedFoodList,
} from "../api/api";
import { FoodCard } from "../components/FoodCard";
import { usePageHeader } from "../hooks/usePageHeader";
import { useEffect, useState } from "react";
import { FoodEntry } from "../types";
import { useParams } from "react-router-dom";

export function AddFromExistingFood() {
  usePageHeader("Add from existing food", true);

  const { id } = useUserContext();
  const { friendId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [sharedFoodEntries, setSharedFoodEntries] = useState<FoodEntry[]>([]);

  const [addingIds, setAddingIds] = useState<Set<string>>(new Set());

  const fetchUserFoodList = async () => {
    const _foodList = await getFoodList(id!);
    setFoodEntries(_foodList);
  };

  const fetchSharedFoodEntries = async () => {
    const _sharedFoodList = await getSharedFoodList(friendId!);
    setSharedFoodEntries(_sharedFoodList);
  };

  const handleAdd = async (foodId: string) => {
    if (addingIds.has(foodId)) return;

    setAddingIds((prev) => {
      const next = new Set(prev);
      next.add(foodId);
      return next;
    });

    try {
      await addFoodEntryToSharedList(id, friendId!, foodId);
      await fetchSharedFoodEntries();
    } catch (error) {
      console.error("Failed to update shared food list", error);
    } finally {
      setAddingIds((prev) => {
        const next = new Set(prev);
        next.delete(foodId);
        return next;
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await fetchUserFoodList();
        await fetchSharedFoodEntries();
      } catch (error) {
        console.error(
          "Failed to fetch user food list and shared food list",
          error
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, friendId]);

  if (isLoading) {
    return (
      <Box component="section">
        <Typography component="h2" variant="body1">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!isLoading && foodEntries.length === 0) {
    return (
      <Box component="section">
        <Typography component="h2" variant="body1">
          No food entries available to add.
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="section">
      <Stack spacing={5} sx={{ alignItems: "center", pb: { xs: 10, sm: 12 } }}>
        {foodEntries.map((e) => (
          <FoodCard
            key={e.id}
            foodEntry={e}
            variant="toAdd"
            isAlreadyAdded={
              sharedFoodEntries.findIndex((sfe) => sfe.id === e.id) >= 0
            }
            onAdd={() => handleAdd(e.id!)}
            addingIds={addingIds}
          />
        ))}
      </Stack>
    </Box>
  );
}
