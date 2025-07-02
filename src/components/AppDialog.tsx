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
  onClose,
  onConfirm,
  onCancel,
  onTextFieldChange,
}: AppDialogProps) {
  const isConfirmDisabled = withTextField && textFieldValue.trim() === "";
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
            onChange={(e) => onTextFieldChange?.(e.target.value)}
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
