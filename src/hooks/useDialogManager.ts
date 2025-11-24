import { useCallback, useState } from "react";
import { DialogConfig } from "../types";

export const DEFAULT_DIALOG_CONFIG: DialogConfig = {
  titleText: "",
  contentText: "",
  primaryBtnLabel: "",
  onPrimaryAction: () => {},
  secondaryBtnLabel: "",
  onSecondaryAction: () => {},
};

export function useDialogManager() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [dialogConfig, setDialogConfig] = useState<DialogConfig>(
    DEFAULT_DIALOG_CONFIG
  );

  const openDialog = useCallback((config: Partial<DialogConfig>) => {
    setDialogConfig(() => {
      const newConfig = { ...DEFAULT_DIALOG_CONFIG, ...config };

      setDialogOpen(true);

      return newConfig;
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setDialogConfig(DEFAULT_DIALOG_CONFIG);
  }, []);

  return {
    dialogOpen,
    dialogConfig,
    openDialog,
    closeDialog,
  };
}
