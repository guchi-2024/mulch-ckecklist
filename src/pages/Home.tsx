
import { red, yellow, grey} from '@mui/material/colors';
import { Box, List, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '../types';

interface HomeProps {
  isSetting: boolean;
}

export default function Home({isSetting}: HomeProps) {

  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { text: "A350", 
      path:"/CheckListLayout/A350",
      areaBtn: [ "FWD", "MID", "AFT"] 
    },
    { text: "E170", 
      path:"/CheckListLayout/E170",
      areaBtn: [ "FWD", "AFT"] 
    },
    { text: "ATR", 
      path:"/CheckListLayout/ATR",
      areaBtn: [ "ALL" ] 
    },
  ];

  const handleLinkClick = (ship: MenuItem) => {
    navigate(ship.path, {state: ship})
  }

  const selectShip = (
    <div>

      <List>
        { menuItems.map((ship, index) => (
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
                borderRadius: "3%",
                m: 3,
                ml: 5
              }}
            >
              {ship.text}
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
