import { Stack, Typography } from "@mui/material";

interface EmptyStateProps {
  image: string;
  altText?: string;
  heading?: string;
  textContent: string;
  button?: React.ReactNode;
}

export function EmptyState({
  image,
  altText,
  heading,
  textContent,
  button,
}: EmptyStateProps) {
  return (
    <Stack
      role="region"
      aria-labelledby="empty-state-heading"
      sx={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        mt: 10,
      }}
    >
      <img
        src={image}
        alt={altText || "Empty state illustration"}
        aria-hidden={true}
        style={{ width: "280px", display: "block" }}
      />
      {heading && (
        <Typography
          id="empty-state-heading"
          component="h3"
          variant="h6Branded"
          color="grey.700"
          mt="8px"
        >
          {heading}
        </Typography>
      )}
      <Typography variant="body2" color="grey.700" mt="8px">
        {textContent}
      </Typography>
      {button && <Stack mt="16px">{button}</Stack>}
    </Stack>
  );
}
