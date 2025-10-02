import { Typography } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FoodEntry,
  MealSession,
  MealSessionStage,
  User,
  DialogConfig,
} from "../types";
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

  const defaultDialogConfig: DialogConfig = {
    titleText: "",
    contentText: "",
    primaryBtnLabel: "",
    secondaryBtnLabel: "",
    onPrimaryAction: () => {},
    onSecondaryAction: () => {},
  };
  const [dialogConfig, setDialogConfig] =
    useState<DialogConfig>(defaultDialogConfig);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const canGoBack = useMemo(() => window.history.length > 1, []);
  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [canGoBack, navigate]);

  const sessionStatus = useMemo<MealSessionStage>(
    () => getMealSessionStage(id, session),
    [id, session]
  );

  const reloadSession = useCallback(async () => {
    const _session = await getMealSession(friendId!);
    setSession(_session);
  }, [friendId]);

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

    // modal: empty shared list
    if (sharedFoodList.length === 0) {
      setDialogConfig({
        titleText: "Oops, no shared food to pick from",
        contentText:
          "Your food list with this friend is empty! Add some food to explore your next meal together.",
        primaryBtnLabel: "Add food",
        secondaryBtnLabel: "Close",
        onPrimaryAction: () => {
          setDialogOpen(false);
          navigate(`/friend/${friendId}/shared-food-list`);
        },
        onSecondaryAction: handleDialogClose,
      });
      setDialogOpen(true);
      return;
    }

    // modal: restricted access
    if (
      from !== "requests" &&
      from !== "friend-profile" &&
      from !== "/pick-friend" &&
      (sessionStatus === MealSessionStage.AwaitingPreferencesFromFriend ||
        sessionStatus === MealSessionStage.AwaitingRatingFromFriend)
    ) {
      setDialogConfig({
        titleText: "Oops nothing to do here..",
        contentText: (
          <>
            It's likely your meal session with your friend is awaiting their
            input. Come back at a later stage when action is required from your
            side! <br /> <br /> You can also go to Requests and view your
            ongoing sessions.
          </>
        ),
        primaryBtnLabel: "Close",
        secondaryBtnLabel: "Go to requests",
        onPrimaryAction: () => {
          setDialogOpen(false);
          navigate("/");
        },
        onSecondaryAction: () => {
          setDialogOpen(false);
          navigate("/requests");
        },
      });
      setDialogOpen(true);
      return;
    }

    // modal: ongoing session
    if (
      from !== "/requests" &&
      (sessionStatus === MealSessionStage.AwaitingPreferencesFromFriend ||
        sessionStatus === MealSessionStage.AwaitingRatingFromBoth ||
        sessionStatus === MealSessionStage.AwaitingRatingFromCurrentUser ||
        sessionStatus === MealSessionStage.AwaitingRatingFromFriend)
    ) {
      setDialogConfig({
        titleText: "You're already deciding what to eat together!",
        contentText: (
          <>
            Find your current session in the “Decide what to eat together”
            section in your Requests menu. <br /> <br /> Want to start fresh
            instead? Begin a new session if you'd like.
          </>
        ),
        primaryBtnLabel: "Go to current",
        secondaryBtnLabel: "New session",
        onPrimaryAction: () => {
          setDialogOpen(false);
          navigate("/requests");
        },
        onSecondaryAction: async () => {
          await deleteMealSession(id, friendId!).then(reloadSession);
          setDialogOpen(false);
          navigate(`/eat-together/${friendId}`);
        },
      });
      setDialogOpen(true);
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
  ]);

  if (!isInitialised) return <Typography>Loading...</Typography>;
  if (!friend) return <Typography>Friend not found.</Typography>;

  return (
    <EatTogetherContext.Provider
      value={{ friend: friend!, session, sharedFoodList, reloadSession }}
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
        withTextField={false}
        titleText={dialogConfig.titleText}
        contentText={dialogConfig.contentText}
        primaryBtnLabel={dialogConfig.primaryBtnLabel}
        secondaryBtnLabel={dialogConfig.secondaryBtnLabel}
        onClose={handleDialogClose}
        onSecondaryAction={dialogConfig.onSecondaryAction}
        onPrimaryAction={dialogConfig.onPrimaryAction}
      />
    </EatTogetherContext.Provider>
  );
}
