import { ListItemButton, ListItemText, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ShipSelectClickProps {
  text: string
}

const ShipSelectClick: React.FC<ShipSelectClickProps> = ({text}) => {

  const navigate = useNavigate();

  const handleClick = () => {
    const result = `${text}`
    navigate(`/CheckListLayout? result=${encodeURIComponent(result)}`)
  }

  return (
    <div>
      <ListItemButton
        onClick={handleClick} 
        sx={{
          bgcolor: red[200], 
          "&:hover": {bgcolor: red[500]},
          height: 50,
          width: 200,
          borderRadius: "3%"
        }}
      >
        {/* <ListItemIcon> */}
          {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
        {/* </ListItemIcon> */}
        <ListItemText 
          primary={
            <Typography fontSize={25} fontWeight={"fontWeightBold"}>
              {text}
            </Typography>
          }   
          sx={{
            m: 0,
            P:0,
          }}
         />
      </ListItemButton>
      
    </div>
  )
}

export default ShipSelectClick
