
import { red, yellow, grey, blue} from '@mui/material/colors';
import { Box, List, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MenuList } from '../types';
import { useState } from 'react';

interface HomeProps {
  isSetting: boolean;
}

export default function Home({isSetting}: HomeProps) {

  const[openForm, setOpenForm] = useState(false);

  const shipNavigate = useNavigate();

  const menuList: MenuList[] = [
    { shipName: "A350", 
      path:"/CheckListLayout/A350",
      areaBtn: [ "FWD", "MID", "AFT"],
      ARR: "SETTING",
      DEP: "",
      shipNo: "",
    },
    { shipName: "E170", 
      path:"/CheckListLayout/E170",
      areaBtn: [ "FWD", "AFT"],
      ARR: "SETTING",
      DEP: "",
      shipNo: "", 
    },
    { shipName: "ATR", 
      path:"/CheckListLayout/ATR",
      areaBtn: [ "ALL" ],
      ARR: "SETTING",
      DEP: "",
      shipNo: "", 
    },
  ];

  const handleLinkClick = (ship: MenuList) => {
    shipNavigate(ship.path, {state: ship})
  }

  const selectShip = (
    <div>
      <List>
        { menuList.map((ship, index) => (
          <div
            key={index} 
            onClick={() => handleLinkClick(ship)}
          >
            <ListItemButton
              sx={{
                fontSize: 25,
                fontWeight: "fontWeightBold",
                color: isSetting? grey[600] : grey[100],
                bgcolor: isSetting? yellow[200] : red[200], 
                "&:hover": {bgcolor: isSetting? yellow[600] : red[500]},
                height: 50,
                width: 200,
                borderRadius: "4px",
                border: '2px solid #ffb300',
                m: 3,
                ml: 5
              }}
            >
              {ship.shipName}
            </ListItemButton>
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
