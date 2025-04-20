import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { usePageTitleContext } from "../context/PageTitleContext";

export function Profile() {
  const { avatar, username, email } = useUserContext();
  const { setPageTitle } = usePageTitleContext();

  useEffect(() => {
    setPageTitle(null);
  }, [setPageTitle]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 10,
      }}
    >
      <Box sx={{ position: "relative", mb: 3 }}>
        <Avatar
          src={avatar}
          alt="John Doe"
          sx={{
            height: 112,
            width: 112,
          }}
        />
        <IconButton
          component={Link}
          to="/edit-avatar"
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
      <Typography variant="h6Branded">{username}</Typography>
      <Typography variant="body2" color="grey.700">
        {email}
      </Typography>
    </Box>
  );
}
