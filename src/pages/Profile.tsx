import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { usePageHeader } from "../hooks/usePageHeader";
import { constructAvatarURL } from "../utils/supabase";

export function Profile() {
  usePageHeader("Profile", false);

  const { user } = useUserContext();

  return (
    <Box
      component="section"
      aria-label="Your profile"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 10,
      }}
    >
      <Box sx={{ position: "relative", mb: 3 }}>
        <Avatar
          src={constructAvatarURL(user!.avatar)}
          alt="Your avatar"
          sx={{
            height: 112,
            width: 112,
          }}
        />
        <IconButton
          component={Link}
          to="/edit-avatar"
          aria-label="Edit your avatar"
          sx={{
            position: "absolute",
            bgcolor: "grey.300",
            border: "4px solid",
            borderColor: "#ffffff",
            bottom: 0,
            right: 0,
            "&:hover": {
              color: "inherit",
              bgcolor: "grey.400",
              borderColor: "#ffffff",
            },
          }}
        >
          <Edit sx={{ width: 16, height: 16 }} />
        </IconButton>
      </Box>
      <Typography component="h2" variant="h6Branded">
        {user!.name}
      </Typography>
      <Typography component="h3" variant="body2" color="grey.700">
        {user!.email}
      </Typography>
    </Box>
  );
}
