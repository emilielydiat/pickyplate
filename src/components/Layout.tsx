import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PageHeader } from "./PageHeader";
import { usePageTitleContext } from "../context/PageTitleContext";

export function Layout() {
  const { pageTitle } = usePageTitleContext();

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <PageHeader />
      <Container
        id="main-content"
        role="region"
        aria-label="Main content"
        sx={{ maxWidth: "md", mt: pageTitle ? "176px" : "96px", mx: "auto" }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
