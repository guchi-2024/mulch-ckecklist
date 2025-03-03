
import { red } from '@mui/material/colors';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { CSSProperties, useState } from "react";
import ShipSelectClick from '../components/ShipSelectClick';


interface menuItem {
  text: string,
  path: string 
}

const baseLinkStyle: CSSProperties = {
  textDecoration: "none",
  color: "inherit",
  display: "block",
  width: "30vw",
}

// const activeLinkStyle = {
//   backgroundColor: "rgba(255, 0, 0, 0.5)"
// }


export default function Home() {

  const navigate = useNavigate();

  const MenuItems: menuItem[] = [
    { text: "A350", path:"/CheckListLayout" },
    { text: "E170", path:"/CheckListLayout" },
    { text: "ATR", path:"/CheckListLayout" },
  ];

  const handleLinkClick = (path: string, state: any) => {
    navigate(path, {state})
  }

  

  const selectShip = (
    <div>

      <List>
        { MenuItems.map((item, index) => (
          <div
            key={index} 
            onClick={() => handleLinkClick(item.path, item.text)}
            // style={() => {
            //   return {
            //     ...baseLinkStyle,
            //   }
            // }}
          >
            <ListItem key={index}  sx={{m: 3, ml: 0}}>
             <ShipSelectClick text={item.text}/>
            </ListItem>
          </div>
        ))}
      </List>
    </div>
  )    
  return (
    <Box>
      {selectShip}
    </Box>
    
  );
}
