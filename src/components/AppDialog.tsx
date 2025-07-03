import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

interface AppDialogProps {
  open: boolean;
  withTextField: boolean;
  titleText: string;
  contentText?: string;
  confirmBtnLabel: string;
  cancelBtnLabel?: string;
  textFieldLabel?: string;
  textFieldValue?: string;
  textFieldError?: boolean;
  textFieldHelperText?: string;

  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  onTextFieldChange?: (value: string) => void;
}

export function AppDialog({
  open,
  withTextField = false,
  titleText,
  contentText,
  confirmBtnLabel,
  cancelBtnLabel,
  textFieldLabel,
  textFieldValue = "",
  textFieldError,
  textFieldHelperText,
  onClose,
  onConfirm,
  onCancel,
  onTextFieldChange,
}: AppDialogProps) {
  const isConfirmDisabled =
    (withTextField && textFieldValue.trim() === "") || textFieldError;
  const titleId = "dialog-title";
  const contentId = "dialog-description";

  return (
    <Dialog
      aria-labelledby={titleId}
      aria-describedby={contentText ? contentId : undefined}
      open={open}
      onClose={onClose}
      sx={{ textAlign: "left" }}
    >
      <DialogTitle id={titleId}>{titleText}</DialogTitle>
      <DialogContent>
        {contentText && (
          <DialogContentText id={contentId}>{contentText}</DialogContentText>
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
        {cancelBtnLabel && onCancel && (
          <Button variant="outlined" type="button" onClick={onCancel}>
            {cancelBtnLabel}
          </Button>
        )}
        <Button
          variant="contained"
          type="button"
          disabled={isConfirmDisabled}
          onClick={onConfirm}
        >
          {confirmBtnLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
