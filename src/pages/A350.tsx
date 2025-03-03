import React from 'react'

interface A350PositionTypus{
  text: string,
  path: string
}

export const A350Position: A350PositionTypus[]= [
   //path: "/CheckListLayout"は、仮のものでありpathの行き先が決定しだい要変更 
   {text: "FWD", path: "/CheckListLayout"},
   {text: "MID", path: "/CheckListLayout"},
   {text: "AFT", path: "/CheckListLayout"},  
]

