import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';
import SideBar from '../common/SideBar';
import { blue, grey, yellow} from '@mui/material/colors';

const drawerWidth = 240;

interface AppLayoutProps {
  setIsSetting: React.Dispatch<React.SetStateAction<boolean>>;
  isSetting: boolean;
  isAdd: boolean;
  setIsAdd: React.Dispatch<React.SetStateAction<boolean>>;
  isDelete: boolean;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  currentDateTimeFormatted: string;
}

export default function AppLayout({
  isSetting, 
  setIsSetting,
  isAdd,
  setIsAdd,
  isDelete,
  setIsDelete,
  isEdit,
  setIsEdit,
  currentDateTimeFormatted,
}: AppLayoutProps) {

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };



 
  return (
    <Box sx={{ 
      display: 'flex',
      bgcolor: (theme) => theme.palette.grey[800],
      color: (theme) => theme.palette.grey[100],
      minHeight: "100vh", 
      }} >
      <CssBaseline />
      {/* ヘッダー */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#424242",
          color: "#f5f5f5",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: blue[300] }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            noWrap 
            component="div" 
            fontWeight="fontWeightBold"
            sx={{color: isSetting ? yellow[300] : grey[100]}}
          >
            {isSetting ?  "設定モード": "チェックリスト" }
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ml: 'auto', color: grey[100]}}
          >
            {currentDateTimeFormatted}
          </Typography>
        </Toolbar>
      </AppBar>
      {/* サイドバー */}
      <SideBar
        drawerWidth = {drawerWidth}
        mobileOpen = {mobileOpen}
        handleDrawerClose = {handleDrawerClose}
        handleDrawerTransitionEnd = {handleDrawerTransitionEnd}
        setIsSetting = {setIsSetting}
        isSetting = {isSetting}
        isAdd={isAdd}
        setIsAdd={setIsAdd}
        isDelete={isDelete}
        setIsDelete={setIsDelete}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setMobileOpen={setMobileOpen}
      />
      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 0, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

