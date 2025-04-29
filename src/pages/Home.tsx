import { Button, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import { usePageTitleContext } from "../context/PageTitleContext";

export function Home() {
  const { username } = useUserContext();
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle(null);
  }, [setPageTitle]);

  return (
    <Box
      component="section"
      aria-labelledby="welcome-section"
      sx={{
        minHeight: "calc(100vh - 128px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography id="welcome-section" component="h1" variant="h6">
        Welcome, {username}
      </Typography>
      <Typography variant="body2" sx={{ color: "grey.700", mb: 2 }}>
        Hungry for a decision?
      </Typography>
      <Button component={Link} to="/pick-friend" variant="contained">
        Eat together
      </Button>
    </Box>
  );
}
