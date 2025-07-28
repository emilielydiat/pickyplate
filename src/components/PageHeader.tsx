import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Navbar } from "./Navbar";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitleContext } from "../context/PageTitleContext";

export function PageHeader() {
  const { pageTitle, showBackBtn } = usePageTitleContext();
  const navigate = useNavigate();

  const canGoBack = useMemo(() => window.history.length > 1, []);
  const handleBack = () => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <AppBar
      component="header"
      aria-label="Site header"
      sx={{
        color: "inherit",
        bgcolor: "#ffffff",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Container sx={{ maxWidth: "md" }}>
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Navbar />
          {pageTitle && (
            <Box
              sx={{
                width: "100%",
                minHeight: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "48px",
                }}
              >
                {showBackBtn && (
                  <IconButton
                    aria-label="Go back"
                    onClick={handleBack}
                    sx={{ width: "48px", height: "48px" }}
                  >
                    <ArrowBack fontSize="medium" />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ flexGrow: 1, textAlign: "center", px: 1 }}>
                <Typography component="h1" variant="h6" aria-label={pageTitle}>
                  {pageTitle}
                </Typography>
              </Box>
              <Box sx={{ width: "48px" }}></Box>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
