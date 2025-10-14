import { Typography } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FoodEntry, MealSession, MealSessionStage, User } from "../types";
import {
  getMealSession,
  getSharedFoodList,
  getUserById,
  deleteMealSession,
} from "../api/api";
import { EatTogetherContext } from "../context/EatTogetherContext";
import { getMealSessionStage } from "../utils/mealSession";
import { useUserContext } from "../context/UserContext";
import { MealPreferences } from "./MealPreferences";
import { SubmitRating } from "./SubmitRating";
import { ViewResults } from "./ViewResults";
import { AppDialog } from "../components/AppDialog";
import { useDialogManager } from "../hooks/useDialogManager";

export function EatTogether() {
  const { friendId } = useParams();
  const { id } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from;

  const [isInitialised, setIsInitialised] = useState(false);
  const [session, setSession] = useState<MealSession | null>(null);
  const [sharedFoodList, setSharedFoodList] = useState<FoodEntry[]>([]);
  const [friend, setFriend] = useState<User | null>(null);

  const sessionStatus = useMemo<MealSessionStage>(
    () => getMealSessionStage(id, session),
    [id, session]
  );

  const reloadSession = useCallback(async () => {
    const _session = await getMealSession(friendId!);
    setSession(_session);
  }, [friendId]);

  const canGoBack = window.history.length > 1;

  const { dialogOpen, dialogConfig, openDialog, closeDialog } =
    useDialogManager();

  const handleDialogClose = useCallback(() => {
    closeDialog();
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [closeDialog, canGoBack, navigate]);

  const showEmptyListDialog = useCallback(() => {
    openDialog({
      titleText: "Oops, no shared food to pick from",
      contentText:
        "Your food list with this friend is empty! Add some food to explore your next meal together.",
      primaryBtnLabel: "Add food",
      secondaryBtnLabel: "Close",
      onPrimaryAction: () => {
        navigate(`/friend/${friendId}/shared-food-list`);
      },
      onSecondaryAction: handleDialogClose,
    });
  }, [openDialog, friendId, navigate, handleDialogClose]);

  const showRestrictedAccessDialog = useCallback(() => {
    openDialog({
      titleText: "You're all set for now",
      contentText:
        "You've already done your part. We're waiting on your friend to respond before you can continue.\n\nWant to see where things stand? Head to the Requests menu.",
      primaryBtnLabel: "Close",
      secondaryBtnLabel: "Open requests menu",
      onPrimaryAction: () => {
        closeDialog();
        navigate("/");
      },
      onSecondaryAction: () => {
        closeDialog();
        navigate("/requests");
      },
    });
  }, [openDialog, closeDialog, navigate]);

  const showOngoingSessionDialog = useCallback(() => {
    openDialog({
      titleText: "You're already deciding what to eat together!",
      contentText:
        "Find your current session in the “Decide what to eat together” section in your Requests menu.\n\nWant to start fresh instead? Begin a new session if you'd like.",
      primaryBtnLabel: "Go to current",
      secondaryBtnLabel: "New session",
      onPrimaryAction: () => {
        closeDialog();
        navigate("/requests");
      },
      onSecondaryAction: async () => {
        await deleteMealSession(id, friendId!);
        await reloadSession();
        closeDialog();
        navigate(`/eat-together/${friendId}`);
      },
    });
  }, [openDialog, id, friendId, navigate, closeDialog, reloadSession]);

  useEffect(() => {
    (async () => {
      setIsInitialised(false);

      const [_session, _friend, foodList] = await Promise.all([
        getMealSession(friendId!),
        getUserById(friendId!),
        getSharedFoodList(friendId!),
      ]);

      setSession(_session);
      setFriend(_friend);
      setSharedFoodList(foodList);

      setIsInitialised(true);
    })();
  }, [friendId]);

  useEffect(() => {
    if (!isInitialised) return;

    if (sharedFoodList.length === 0) {
      showEmptyListDialog();
      return;
    }

    if (
      from !== "requests" &&
      from !== "friend-profile" &&
      from !== "/pick-friend" &&
      (sessionStatus === MealSessionStage.AwaitingPreferencesFromFriend ||
        sessionStatus === MealSessionStage.AwaitingRatingFromFriend)
    ) {
      showRestrictedAccessDialog();
      return;
    }

    if (
      from !== "/requests" &&
      (sessionStatus === MealSessionStage.AwaitingPreferencesFromFriend ||
        sessionStatus === MealSessionStage.AwaitingRatingFromBoth ||
        sessionStatus === MealSessionStage.AwaitingRatingFromCurrentUser ||
        sessionStatus === MealSessionStage.AwaitingRatingFromFriend)
    ) {
      showOngoingSessionDialog();
    }
  }, [
    isInitialised,
    sharedFoodList.length,
    sessionStatus,
    friendId,
    navigate,
    handleDialogClose,
    id,
    reloadSession,
    from,
    showEmptyListDialog,
    showRestrictedAccessDialog,
    showOngoingSessionDialog,
  ]);

  if (!isInitialised) return <Typography>Loading...</Typography>;
  if (!friend) return <Typography>Friend not found.</Typography>;

  return (
    <EatTogetherContext.Provider
      value={{ friend, session, sharedFoodList, reloadSession }}
    >
      {[
        MealSessionStage.NotStarted,
        MealSessionStage.AwaitingPreferencesFromBoth,
        MealSessionStage.AwaitingPreferencesFromCurrentUser,
      ].includes(sessionStatus!) && <MealPreferences />}

      {[
        MealSessionStage.AwaitingRatingFromBoth,
        MealSessionStage.AwaitingRatingFromCurrentUser,
      ].includes(sessionStatus) && <SubmitRating />}

      {sessionStatus === MealSessionStage.Completed && <ViewResults />}

      <AppDialog
        open={dialogOpen}
        titleText={dialogConfig.titleText}
        contentText={dialogConfig.contentText}
        onClose={handleDialogClose}
        primaryBtnLabel={dialogConfig.primaryBtnLabel}
        onPrimaryAction={dialogConfig.onPrimaryAction}
        secondaryBtnLabel={dialogConfig.secondaryBtnLabel}
        onSecondaryAction={dialogConfig.onSecondaryAction}
      />
    </EatTogetherContext.Provider>
  );
}
