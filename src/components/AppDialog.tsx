import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface AppDialogProps {
  open: boolean;
  withTextField: boolean;
  titleText: string;
  contentText?: string | React.ReactNode;
  primaryBtnIcon?: React.ReactNode;
  primaryBtnLabel?: string;
  secondaryBtnIcon?: React.ReactNode;
  secondaryBtnLabel?: string;
  textFieldLabel?: string;
  textFieldValue?: string;
  textFieldError?: boolean;
  textFieldHelperText?: string;
  onClose: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onTextFieldChange?: (value: string) => void;
}

export function AppDialog({
  open,
  withTextField = false,
  titleText,
  contentText,
  primaryBtnIcon,
  primaryBtnLabel,
  secondaryBtnIcon,
  secondaryBtnLabel,
  textFieldLabel,
  textFieldValue = "",
  textFieldError,
  textFieldHelperText,
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  onTextFieldChange,
}: AppDialogProps) {
  const isPrimaryActionDisabled =
    (withTextField && textFieldValue.trim() === "") || textFieldError;
  const titleId = "dialog-title";
  const contentId = "dialog-description";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={contentText ? contentId : undefined}
      open={open}
      onClose={onClose}
      sx={{ textAlign: "left" }}
    >
      <DialogTitle id={titleId}>{titleText}</DialogTitle>
      <DialogContent>
        {contentText && (
          <DialogContentText id={contentId} sx={{ whiteSpace: "pre-line" }}>
            {contentText}
          </DialogContentText>
        )}

        {withTextField && (
          <TextField
            label={textFieldLabel}
            variant="outlined"
            margin="dense"
            autoFocus
            fullWidth
            value={textFieldValue}
            helperText={textFieldHelperText}
            onChange={(e) => onTextFieldChange?.(e.target.value)}
            error={textFieldError}
          />
        )}
      </DialogContent>
      <DialogActions>
        {isMobile ? (
          <Stack sx={{ width: "100%", gap: 1 }}>
            <Button
              startIcon={primaryBtnIcon}
              variant="contained"
              fullWidth
              type="button"
              disabled={isPrimaryActionDisabled}
              onClick={onPrimaryAction}
            >
              {primaryBtnLabel}
            </Button>
            {secondaryBtnLabel && onSecondaryAction && (
              <Button
                startIcon={secondaryBtnIcon}
                variant="outlined"
                fullWidth
                type="button"
                onClick={onSecondaryAction}
              >
                {secondaryBtnLabel}
              </Button>
            )}
          </Stack>
        ) : (
          <Stack sx={{ flexDirection: "row-reverse", width: "100%", gap: 1 }}>
            <Button
              startIcon={primaryBtnIcon}
              variant="contained"
              type="button"
              disabled={isPrimaryActionDisabled}
              onClick={onPrimaryAction}
            >
              {primaryBtnLabel}
            </Button>
            {secondaryBtnLabel && onSecondaryAction && (
              <Button
                startIcon={secondaryBtnIcon}
                variant="outlined"
                type="button"
                onClick={onSecondaryAction}
              >
                {secondaryBtnLabel}
              </Button>
            )}
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}
