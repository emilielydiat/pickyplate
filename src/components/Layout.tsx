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
      <PageHeader pageTitle={pageTitle} />
      <Container
        sx={{ maxWidth: "md", mt: pageTitle ? "176px" : "96px", mx: "auto" }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
