import { Box, Collapse, Toolbar } from "@mui/material"
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
import { grey, yellow, } from '@mui/material/colors';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { fontSize } from "@material-ui/system";
import  ArticleIcon from '@mui/icons-material/Article';
import SubSettingButton from "./SubSettingButton";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerTransitionEnd: () => void;
  handleDrawerClose: () => void;
  setIsSetting: React.Dispatch<React.SetStateAction<boolean>>;
  isSetting: boolean;
  isAdd: boolean;
  setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
  isDelete: boolean;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SideBar = (
  { drawerWidth,
    mobileOpen,
    handleDrawerTransitionEnd,
    handleDrawerClose,
    setIsSetting,
    isSetting,
    isAdd,
    setIsAdd,
    isDelete,
    setIsDelete,
    isEdit,
    setIsEdit,
    setMobileOpen,
  }: SidebarProps
) => {

  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
    fontSize: "25px"
  }

  const activeLinkStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.08)"
  }

  const handleIsSetting = () => {
    if (isSetting) {
      setIsSetting(false);
      setIsAdd(false);
      setIsDelete(false)
    } else {
      setIsSetting(true);
    }
  }

  const handleIsAdd = () => {
    if (isAdd) {
      setIsAdd(false);
    } else {
      setIsAdd(true);
      setIsDelete(false);
      setIsEdit(false);  
      setMobileOpen(false); 
    }
  }

  const handleIsDelete = () => {
    if(isDelete) {
      setIsDelete(false);
    } else {
      setIsDelete(true);
      setIsAdd(false);
      setIsEdit(false);
      setMobileOpen(false); 
    }
  }

  const handleIsEdit = () => {
    if(isEdit) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
      setIsDelete(false);
      setIsAdd(false);
      setMobileOpen(false); 
    }
  }
  

// MUI Drower の Toolpad を参照
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        
          <NavLink
            to="/"
            style={({isActive}) => {
              return {
                ...baseLinkStyle,
                ...(isActive ? activeLinkStyle : {})
              }
            }}
          >
            <ListItem 
              disablePadding 
              onClick={handleIsSetting}>          
              <ListItemButton 
                sx={{
                  color: isSetting ? yellow[700] : grey[900],
                  pr: 0
                }}
              >
                <ListItemText
                  primary="設定"
                  slotProps={{
                    primary: {
                      sx: { fontSize: "25px"}
                    }
                  }}
                  />
                <ListItemIcon 
                  sx={{
                    justifyContent: 'center',
                    transform: isSetting ?'rotate(90deg)': null,
                    
                  }}
                  >
                  <ArrowForwardIosIcon />
                </ListItemIcon>    
              </ListItemButton>
            </ListItem>
          </NavLink>

         <Collapse in={isSetting} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <SubSettingButton
                baseLinkStyle={baseLinkStyle}
                activeLinkStyle={activeLinkStyle}
                text="追加"
                IconComponent={AddCircleOutlineIcon}
                iconColor="#2196f3"
                handleClick={handleIsAdd}
              />
              <SubSettingButton
                baseLinkStyle={baseLinkStyle}
                activeLinkStyle={activeLinkStyle}
                text="変更"
                IconComponent={EditIcon}
                iconColor="#00e676"
                handleClick={handleIsEdit} 
              />
              <SubSettingButton
                baseLinkStyle={baseLinkStyle}
                activeLinkStyle={activeLinkStyle}
                text="削除" 
                IconComponent={DeleteIcon}
                iconColor="#ff5722"
                handleClick={handleIsDelete}
              />
                  
            </List>
          </Collapse>
              
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
