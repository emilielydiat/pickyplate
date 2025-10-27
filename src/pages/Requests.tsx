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
import { Add, ArrowForward, Check, Close } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import {
  confirmFriendRequest as _confirmFriendRequest,
  getMealSessions,
} from "../api/api";
import { usePageHeader } from "../hooks/usePageHeader";
import { constructAvatarURL } from "../utils/supabase";
import { useFriendsContext } from "../context/FriendsContext";
import { FriendRequest, MealSession, MealSessionStage } from "../types";
import { EmptyState } from "../components/EmptyState";
import { useEffect, useState } from "react";
import {
  determineIfUserIsInitiator,
  getMealSessionStage,
} from "../utils/mealSession";

export function Requests() {
  usePageHeader("Requests", false);

  const navigate = useNavigate();
  const { id } = useUserContext();
  const { requests, requestUsers, reload, friends, isLoading } =
    useFriendsContext();

  const [sessions, setSessions] = useState<MealSession[]>([]);

  const getRequestUser = ({ initiator_id, target_id }: FriendRequest) => {
    const userId = initiator_id === id ? target_id : initiator_id;
    return requestUsers.find((u) => u.id === userId);
  };

  const getSessionFriendId = (session: MealSession) =>
    determineIfUserIsInitiator(id, session)
      ? session.friend_id
      : session.initiator_id;

  const getUserByFriendId = (friendId: string) =>
    friends.find((f) => f.id === friendId);

  const confirmFriendRequest = async (
    action: "accept" | "reject",
    userId: string
  ) => {
    await _confirmFriendRequest(action, userId);
    await reload();

    if (action === "accept") {
      navigate("/friends");
    }
  };

  useEffect(() => {
    (async () => {
      const _sessions = await getMealSessions(id);
      setSessions(_sessions);
    })();
  }, [id]);

  const getSessionButtonText = (session: MealSession) => {
    const status = getMealSessionStage(id, session);

    switch (status) {
      case MealSessionStage.AwaitingPreferencesFromBoth:
      case MealSessionStage.AwaitingPreferencesFromCurrentUser:
      case MealSessionStage.AwaitingRatingFromBoth:
      case MealSessionStage.AwaitingRatingFromCurrentUser:
        return "Resume";
      case MealSessionStage.Completed:
        return "View results";
      default:
        return "Waiting";
    }
  };

  const getSessionButtonDisabled = (session: MealSession) => {
    const status = getMealSessionStage(id, session);
    const isUserInitiator = determineIfUserIsInitiator(id, session);

    switch (status) {
      case MealSessionStage.AwaitingPreferencesFromBoth:
      case MealSessionStage.AwaitingPreferencesFromCurrentUser:
      case MealSessionStage.AwaitingRatingFromBoth:
      case MealSessionStage.AwaitingRatingFromCurrentUser:
      case MealSessionStage.Completed:
        return false;
      case MealSessionStage.AwaitingPreferencesFromFriend:
        return isUserInitiator;
      default:
        return true;
    }
  };

  if (isLoading) return "Loading..";

  return (
    <Box component="section">
      <Stack>
        <Typography
          component="h2"
          variant="h6Branded"
          textAlign="left"
          mb="16px"
        >
          Friend requests
        </Typography>

        {requests.length === 0 && (
          <EmptyState
            textContent="No friend requests at the moment. Enjoy the peace!"
            button={
              <Button
                startIcon={<Add />}
                variant="contained"
                onClick={() => navigate("/friends/add-friend")}
              >
                Add friend
              </Button>
            }
          />
        )}

        <List>
          {requests.map((r) => (
            <ListItem
              key={`${r.initiator_id}-${r.target_id}`}
              sx={{ px: 0, textDecoration: "none", color: "inherit" }}
            >
              <ListItemAvatar>
                <Avatar
                  src={constructAvatarURL(getRequestUser(r)!.avatar)}
                  alt={`Avatar of ${getRequestUser(r)!.name}`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={getRequestUser(r)!.name}
                sx={{ pr: 2, wordBreak: "break-word" }}
              />
              {r.initiator_id === id ? (
                "Pending"
              ) : (
                <Stack direction="row" spacing={2}>
                  <IconButton
                    aria-label={`Reject friend request from ${getRequestUser(r)!.name}`}
                    onClick={() =>
                      confirmFriendRequest("reject", getRequestUser(r)!.id)
                    }
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
                    aria-label={`Accept friend request from ${getRequestUser(r)!.name}`}
                    onClick={() =>
                      confirmFriendRequest("accept", getRequestUser(r)!.id)
                    }
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
              )}
            </ListItem>
          ))}
        </List>
      </Stack>
      <Stack>
        <Typography
          component="h2"
          variant="h6Branded"
          textAlign="left"
          mb="16px"
        >
          Decide what to eat together
        </Typography>

        {sessions.length === 0 ? (
          <EmptyState
            textContent="You've got no meal plans… yet. Time to make some plans?"
            button={
              <Button
                startIcon={<ArrowForward />}
                variant="contained"
                onClick={() => navigate("/pick-friend")}
              >
                Eat together
              </Button>
            }
          />
        ) : (
          <List>
            {sessions.map((session) => {
              const friendId = getSessionFriendId(session);

              return (
                <ListItem
                  key={friendId}
                  aria-label={`Meal session with ${friendId}`}
                  sx={{ px: 0, textDecoration: "none", color: "inherit" }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={constructAvatarURL(
                        getUserByFriendId(friendId)!.avatar
                      )}
                      alt={`Avatar of ${getUserByFriendId(friendId)!.name}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={getUserByFriendId(friendId)!.name}
                    sx={{ pr: 2, wordBreak: "break-word" }}
                  />

                  <Button
                    component={Link}
                    to={`/eat-together/${friendId}`}
                    state={{ from: "/requests" }}
                    aria-label={`Open meal session with ${friendId}`}
                    variant="contained"
                    sx={{ cursor: "pointer" }}
                    disabled={getSessionButtonDisabled(session)}
                  >
                    {getSessionButtonText(session)}
                  </Button>

                  {/*{!session.isInitiator && session.status === "invited" ? (*/}
                  {/*  <Stack direction="row" spacing={2}>*/}
                  {/*    <IconButton*/}
                  {/*      aria-label={`Reject invitation to eat together from ${session.friendUsername}`}*/}
                  {/*      onClick={() => handleReject(id, session.friendId)}*/}
                  {/*      size="small"*/}
                  {/*      sx={(theme) => ({*/}
                  {/*        width: "40px",*/}
                  {/*        height: "40px",*/}
                  {/*        color: theme.palette.primary.main,*/}
                  {/*        bgcolor: "white",*/}
                  {/*        border: `1px solid ${theme.palette.primary.main}`,*/}
                  {/*      })}*/}
                  {/*    >*/}
                  {/*      <Close />*/}
                  {/*    </IconButton>*/}
                  {/*    <IconButton*/}
                  {/*      aria-label={`Accept invitation to eat together from ${session.friendUsername}`}*/}
                  {/*      onClick={() => handleAccept(session.friendId, id)}*/}
                  {/*      size="small"*/}
                  {/*      sx={(theme) => ({*/}
                  {/*        width: "40px",*/}
                  {/*        height: "40px",*/}
                  {/*        color: "white",*/}
                  {/*        bgcolor: theme.palette.primary.main,*/}
                  {/*        "&:hover": {*/}
                  {/*          bgcolor: theme.palette.primary.dark,*/}
                  {/*        },*/}
                  {/*      })}*/}
                  {/*    >*/}
                  {/*      <Check />*/}
                  {/*    </IconButton>*/}
                  {/*  </Stack>*/}
                  {/*) : (*/}
                  {/*  <Button*/}
                  {/*    component={Link}*/}
                  {/*    to={`/eat-together/${session.friendId}/${sessionPath}`}*/}
                  {/*    aria-label={`Open meal session with ${session.friendUsername}`}*/}
                  {/*    disabled={buttonDisabled}*/}
                  {/*    variant="contained"*/}
                  {/*    sx={{ cursor: "pointer" }}*/}
                  {/*  >*/}
                  {/*    {buttonLabel}*/}
                  {/*  </Button>*/}
                  {/*)}*/}
                </ListItem>
              );
            })}
          </List>
        )}
      </Stack>
    </Box>
  );
}
