import "@mui/material/styles";
import "@mui/material/Typography";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    h6Branded: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    h6Branded?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    h6Branded: true;
  }
}
