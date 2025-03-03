import { Grid } from '@material-ui/core'
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { blueGrey, grey, red } from '@mui/material/colors'
import React, { CSSProperties } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
// import {shipText} from '../../pages/Home'


interface positionItem {
  text: string,
  path: string
}


const CheckListLayout: React.FC = () => {

  const location = useLocation();
  const result =location.state
  
  const PositionItems: positionItem[] = [
    //path: "/CheckListLayout"は、仮のものでありpathの行き先が決定しだい要変更 
    {text: "FWD", path: "/CheckListLayout"},
    {text: "MID", path: "/CheckListLayout"},
    {text: "AFT", path: "/CheckListLayout"},
  ]

  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  }

  return (
    <Grid container>
      <Grid item xs={2}>
        <Box bgcolor="#37474f" sx={{minHeight: "100vh"}}>
          <List>
            { PositionItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
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
                         {item.text}
                       </Typography>
                      
                        } />
                  </ListItemButton>
                </ListItem>
              </NavLink>  
            ))}
          </List>  
        </Box>
        
      </Grid>
      <Grid item xs={10}>
        <Box sx={{
          minHeight: "100vh",
          }}
        >
        {result? <p>{result}</p>:<p>結果なし</p>}
        </Box>
      </Grid>
    </Grid>
  )
}

export default CheckListLayout

