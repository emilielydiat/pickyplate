import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitleContext } from "../context/PageTitleContext";
import { useUserContext } from "../context/UserContext";
import { User } from "../data/mockData";
import {
  AllUserSessionsSummary,
  getAllMealSessionsForUser,
  updateMealSession,
  getCurrentUserFriends,
} from "../api/api";

export function Requests() {
  const [userMealSessions, setUserMealSessions] = useState<
    AllUserSessionsSummary[]
  >([]);
  const [userFriends, setUserFriends] = useState<User[]>([]);
  const { id } = useUserContext();
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Requests");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  useEffect(() => {
    async function fetchSessionsData() {
      const [sessions, friends] = await Promise.all([
        getAllMealSessionsForUser(id),
        getCurrentUserFriends(id),
      ]);
      setUserMealSessions(sessions);
      setUserFriends(friends);
    }
    fetchSessionsData();
  }, [id]);

  console.log("userMealSessions on Requests load: ", userMealSessions);

  const displaySessions = userMealSessions
    .map((session) => {
      const { friendId, initiatorId, status } = session;
      const friend = userFriends.find((friend) => friend.id === friendId);

      return {
        friendId,
        initiatorId,
        status,
        isInitiator: initiatorId === id,
        friendUsername: friend?.username || "Unknown",
        friendAvatar: friend?.avatar || "",
      };
    })
    .sort((a, b) => a.friendUsername.localeCompare(b.friendUsername));

  async function handleReject(initiatorId: string, receiverId: string) {
    await updateMealSession(initiatorId, receiverId, { status: "rejected" });
    const updatedSessions = await getAllMealSessionsForUser(id);
    setUserMealSessions(updatedSessions);
  }

  async function handleAccept(initiatorId: string, receiverId: string) {
    await updateMealSession(initiatorId, receiverId, { status: "accepted" });
    const updatedSessions = await getAllMealSessionsForUser(id);
    setUserMealSessions(updatedSessions);
  }

  function getButtonLabelForSession(session: {
    isInitiator: boolean;
    status: string;
  }): string {
    const { status } = session;

    if (status === "invited") {
      return session.isInitiator ? "Invited" : "Respond";
    }

    if (status === "accepted") {
      return session.isInitiator ? "Invited" : "Start";
    }

    if (status === "rejected") {
      return session.isInitiator ? "Rejected" : "Rejected";
    }

    if (status === "everyone_preferences_set") {
      return "Submit rating";
    }

    if (status === "initiator_rated") {
      return session.isInitiator ? "Awaiting rating" : "Submit rating";
    }

    if (status === "receiver_rated") {
      return session.isInitiator ? "Submit rating" : "Awaiting rating";
    }

    if (status === "everyone_rated") {
      return "View results";
    }

    if (status === "cancelled") {
      return "Cancelled";
    }
    return "";
  }

  function getButtonStateForSession(buttonLabel: string) {
    if (
      buttonLabel === "Invited" ||
      buttonLabel === "Rejected" ||
      buttonLabel === "Awaiting rating" ||
      buttonLabel === "Cancelled"
    )
      return true;
  }

  function getPathForSession(buttonLabel: string) {
    if (buttonLabel === "Start") return "meal-preferences";
    if (buttonLabel === "Submit rating") return "submit-rating";
    if (buttonLabel === "View results") return "view-results";
  }

  return (
    <Box component="section">
      <Stack>
        <Typography
          component="h2"
          variant="h6Branded"
          textAlign="left"
          mb="16px"
        >
          Decide what to eat together
        </Typography>
        <List>
          {displaySessions
            .filter(
              (session) =>
                !(session.status === "rejected" && !session.isInitiator)
            )
            .map((session) => {
              const buttonLabel = getButtonLabelForSession(session);
              const buttonDisabled = getButtonStateForSession(buttonLabel);
              const sessionPath = getPathForSession(buttonLabel);

              return (
                <ListItem
                  key={session.friendId}
                  aria-label={`Meal session with ${session.friendUsername}`}
                  sx={{ px: 0, textDecoration: "none", color: "inherit" }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={session.friendAvatar}
                      alt={`Avatar of ${session.friendUsername}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={session.friendUsername}
                    sx={{ pr: 2, wordBreak: "break-word" }}
                  />
                  {!session.isInitiator && session.status === "invited" ? (
                    <Stack direction="row" spacing={2}>
                      <IconButton
                        aria-label={`Reject invitation to eat together from ${session.friendUsername}`}
                        onClick={() => handleReject(id, session.friendId)}
                        size="small"
                        sx={(theme) => ({
                          width: "40px",
                          height: "40px",
                          color: theme.palette.primary.main,
                          bgcolor: "white",
                          border: `1px solid ${theme.palette.primary.main}`,
                        })}
                      >
                        <Close />
                      </IconButton>
                      <IconButton
                        aria-label={`Accept invitation to eat together from ${session.friendUsername}`}
                        onClick={() => handleAccept(session.friendId, id)}
                        size="small"
                        sx={(theme) => ({
                          width: "40px",
                          height: "40px",
                          color: "white",
                          bgcolor: theme.palette.primary.main,
                          "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                          },
                        })}
                      >
                        <Check />
                      </IconButton>
                    </Stack>
                  ) : (
                    <Button
                      component={Link}
                      to={`/eat-together/${session.friendId}/${sessionPath}`}
                      aria-label={`Open meal session with ${session.friendUsername}`}
                      disabled={buttonDisabled}
                      variant="contained"
                      sx={{ cursor: "pointer" }}
                    >
                      {buttonLabel}
                    </Button>
                  )}
                </ListItem>
              );
            })}
        </List>
      </Stack>
    </Box>
  );
}
