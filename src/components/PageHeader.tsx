import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { Navbar } from "./Navbar";

type PageHeaderProps = {
  pageTitle?: string | null;
};

export function PageHeader({ pageTitle }: PageHeaderProps) {
  return (
    <AppBar
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
                height: 80,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">{pageTitle}</Typography>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
