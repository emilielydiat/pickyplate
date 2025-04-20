import { createTheme } from "@mui/material/styles";

// TO DO
const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h6Branded: {
      fontSize: "20px",
      fontFamily: '"Oleo Script", Arial',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: 0.5,
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#DA3D16",
      light: "#E0572F",
      dark: "#B63312",
    },
    secondary: {
      main: "#3481E8",
      light: "#EBF3FD",
      dark: "#245AA2",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#ffffff",
          color: "#212121",
        },
        a: {
          textDecoration: "none",
          "&:hover": {
            color: "#E0572F",
          },
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "md",
      },
      styleOverrides: {
        root: {
          pl: "16px !important",
          pr: "16px !important",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-contained:hover": {
            color: "#ffffff",
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          "&:hover": {
            color: "#ffffff",
          },
        },
      },
    },
  },
});

export default theme;
