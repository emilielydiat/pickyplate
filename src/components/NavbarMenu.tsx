import { Menu, MenuItem, ListItemIcon, Divider, Button } from "@mui/material";
import {
  AccountCircle,
  Groups,
  Restaurant,
  Notifications,
  Settings,
  Logout,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import supabase from "../supabase";

type NavbarMenuProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchorEl: null | HTMLElement;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
};

export function NavbarMenu(props: NavbarMenuProps) {
  function handleMenuClose() {
    props.setOpen(false);
    props.setAnchorEl(null);
  }

  return (
    <>
      <Menu
        id="user-menu"
        aria-label="User menu"
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <Button
            component={Link}
            to="/pick-friend"
            variant="contained"
            onClick={handleMenuClose}
          >
            Eat together
          </Button>
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem component={Link} to="/friends" onClick={handleMenuClose}>
          <ListItemIcon>
            <Groups />
          </ListItemIcon>
          Friends
        </MenuItem>
        <MenuItem component={Link} to="/my-food-list" onClick={handleMenuClose}>
          <ListItemIcon>
            <Restaurant />
          </ListItemIcon>
          My food list
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/requests" onClick={handleMenuClose}>
          <ListItemIcon>
            <Notifications />
          </ListItemIcon>
          Requests
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/settings" onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => supabase.auth.signOut()}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
