import { Typography } from "@mui/material";
import { useEffect } from "react";
import { usePageTitleContext } from "../context/PageTitleContext";
import { User } from "../data/mockData";

interface CreateFoodProps {
  friend?: User;
}

export function CreateFood({ friend }: CreateFoodProps) {
  const { setPageTitle } = usePageTitleContext();
  useEffect(() => {
    setPageTitle("Create new food");
    return () => setPageTitle(null);
  }, [setPageTitle]);

  return <Typography>Create new food page (coming soon)</Typography>;
}
