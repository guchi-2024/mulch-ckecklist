import { Box, Toolbar } from "@mui/material"
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import { NavLink } from "react-router-dom";
import { CSSProperties } from "react";

interface SidebarProps {
  drawerWidth: number,
  mobileOpen: boolean,
  handleDrawerTransitionEnd: () => void,
  handleDrawerClose: () => void,
}

interface menuItem {
  text: string,
  path: string
}

const SideBar = (
  { drawerWidth,
    mobileOpen,
    handleDrawerTransitionEnd,
    handleDrawerClose,
  }: SidebarProps
) => {

  const MenuItems: menuItem[] = [
    { text: "Home", path: "/" }, 
    { text: "A350", path:"/CheckListLayout" },
  ]

  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  }

  const activeLinkStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.08)"
  }


  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        { MenuItems.map((item, index) => (
          <NavLink
            key={index} 
            to={item.path}
            style={({isActive}) => {
              return {
                ...baseLinkStyle,
                ...(isActive ? activeLinkStyle : {})
              }
            }}
          >
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
      
    </div>
  );
  return (
    <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* モバイル用 */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* PC用 */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
  )
}

export default SideBar
