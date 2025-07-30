import {
  Avatar,
  Box,
  Button,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import logoSmall from "../assets/logo-small.svg";
import { NavbarMenu } from "./NavbarMenu";
import { useUserContext } from "../context/UserContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SupabaseUserContext } from "../context/SupabaseUserContext.tsx";

export function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { avatar, username } = useUserContext();
  const { user } = useContext(SupabaseUserContext);

  function handleMenuToggle(event: React.MouseEvent<HTMLElement>) {
    setOpen((prev) => !prev);
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  }

  return (
    <Box component="nav" aria-label="Main navigation" sx={{ width: "100%" }}>
      <Box
        sx={{
          height: "64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MuiLink
          component={Link}
          to="/"
          aria-label="Homepage"
          sx={{ display: "flex", alignItems: "center", height: 48 }}
        >
          <img src={logoSmall} alt="PickyPlate logo" />
        </MuiLink>
        <Button
          aria-controls={open ? "user-menu" : undefined}
          aria-label="Open user menu"
          aria-haspopup="menu"
          aria-expanded={open}
          startIcon={<Avatar src={avatar} alt={`${username}'s avatar`} />}
          endIcon={
            <KeyboardArrowDown sx={{ display: { xs: "none", sm: "inline" } }} />
          }
          variant="text"
          onClick={handleMenuToggle}
          sx={{
            color: "text.primary",
            p: { xs: 0 },
            minWidth: 0,
            "& .MuiButton-startIcon": {
              margin: { xs: 0, sm: "0 8px 0 0" },
            },
            "& .MuiButton-endIcon": {
              margin: { xs: 0, sm: "0 0 0 8px" },
            },
          }}
        >
          <Typography sx={{ display: { xs: "none", sm: "inline" } }}>
            {user!.name}
          </Typography>
        </Button>
      </Box>
      <NavbarMenu
        open={open}
        setOpen={setOpen}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </Box>
  );
}
