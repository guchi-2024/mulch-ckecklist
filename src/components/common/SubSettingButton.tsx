import React from 'react'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { NavLink } from 'react-router-dom';
import { CSSProperties } from "react";
import { SvgIconProps } from '@mui/material/SvgIcon';

interface SubSettingButtonProps {
  baseLinkStyle: CSSProperties;
  activeLinkStyle: CSSProperties;
  text: string;
  IconComponent: React.ElementType<SvgIconProps>;
  iconColor: string;
  handleClick: () => void;

}

const SubSettingButton = ({
  baseLinkStyle,
  activeLinkStyle,
  text,
  IconComponent,
  iconColor,
  handleClick
}:SubSettingButtonProps) => {
  return (
    <NavLink
       to="/" 
       style={({isActive}) => {
         return {
           ...baseLinkStyle,
           fontSize: "20px", 
           ...(isActive ? activeLinkStyle : {})
         }
       }}
    >
      <ListItemButton 
        sx={{ pl: 4 }}
        onClick={handleClick}
      > 
        <ListItemIcon>
          <IconComponent sx={{color: iconColor}}/>
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </NavLink>
  )
}

export default SubSettingButton
