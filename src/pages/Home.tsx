
import { red } from '@mui/material/colors';
import { Box, List, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface menuItem {
  text: string,
  path: string,
  areaBtn: string[]
}

export default function Home() {

  const navigate = useNavigate();

  const MenuItems: menuItem[] = [
    { text: "A350", 
      path:"/CheckListLayout",
      areaBtn: [ "FWD", "MID", "AFT"] 
    },
    { text: "E170", 
      path:"/CheckListLayout",
      areaBtn: [ "FWD", "AFT"] 
    },
    { text: "ATR", 
      path:"/CheckListLayout",
      areaBtn: [ "ALL" ] 
    },
  ];

  const handleLinkClick = (ship: menuItem) => {
    navigate(ship.path, {state: ship})
  }

  const selectShip = (
    <div>

      <List>
        { MenuItems.map((ship, index) => (
          <div
            key={index} 
            onClick={() => handleLinkClick(ship)}
          >
            <ListItemButton
              sx={{
                fontSize: 25,
                fontWeight: "fontWeightBold",
                bgcolor: red[200], 
                "&:hover": {bgcolor: red[500]},
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
