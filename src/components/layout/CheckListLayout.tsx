import { Grid } from '@material-ui/core'
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { blueGrey, grey } from '@mui/material/colors'
import React, { CSSProperties } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import CheckboxList from '../common/CheckboxList'
// import {shipText} from '../../pages/Home'

interface menuItem {
  text: string,
  path: string,
  areaBtn: string[]
}


const CheckListLayout: React.FC = () => {

  const location = useLocation();
  const ship = location.state as menuItem

  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  }

  return (
    <Grid container>
      {/* 左サイドバー */}
      <Grid item xs={2}>
        <Box 
          bgcolor="#37474f" 
          sx={{
            minHeight: "100vh"
          }}>
          <List>
            { ship.areaBtn.map((area, index) => (
              <NavLink
                key={index}
                to={ship.path}
                style={() => {
                  return {
                    ...baseLinkStyle,
                  }
                }}
              >
                <ListItem 
                  key={index} 
                  disablePadding
                  sx={{borderBottom: 2, borderColor: '#cfd8dc'}}
                >
                  <ListItemButton 
                     sx={{
                      "&:hover": {bgcolor: blueGrey[400]}
                    }}
                  >
                    <ListItemText 
                      primary={
                        <Typography 
                          sx={{
                            fontSize: 30,
                            fontWeight: 'bold',
                          }}
                        >
                         {area}
                       </Typography>
                      
                        } />
                  </ListItemButton>
                </ListItem>
              </NavLink>  
            ))}
          </List>  
        </Box>
        
      </Grid>
      {/* メイン */}
      <Grid item xs={10}>
        <Box 
          sx={{
            minHeight: "100vh",
            borderLeft: 3,
            borderColor: grey[900],
            p: 3
          }}
        >
        <CheckboxList />
        </Box>
      </Grid>
    </Grid>
  )
}

export default CheckListLayout

