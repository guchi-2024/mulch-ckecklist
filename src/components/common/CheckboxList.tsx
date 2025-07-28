import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import { grey, yellow } from '@mui/material/colors';
import { Box, Button, Typography } from '@mui/material';
import { ListItems } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import SettingFormS from './settingFormS';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { addItemSchemaTs, addPositionSchemaTs, editItemSchemaTs, editPositionSchemaTs } from '../../validations/schema';
import SettingFormL from './settingFormL';
import SettingFormM from './settingFormM';
import { positions } from '@material-ui/system';
import SettingFormLL from './settingFormLL';
import DeleteFormItem from './deleteFormItem';
import DeleteFormPosition from './deleteFormPosition';


interface CheckboxListProps {
  areaPosition: string;
  currentListItems: ListItems[];
  isSetting: boolean;
  isAdd: boolean;
  isDelete: boolean;
  isEdit: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ship: string;
  areaName: string;
  onSaveAddPosition: (addPosition: addPositionSchemaTs) => Promise<void>;
  setSettingFormShip: React.Dispatch<React.SetStateAction<string>>;
  setSettingFormArea: React.Dispatch<React.SetStateAction<string>>;
  setSettingFormPosition: React.Dispatch<React.SetStateAction<string>>;
  onSaveAddItem: (addItem: addItemSchemaTs) => Promise<void>;
  selectArea: string[];
  setOldPosition: React.Dispatch<React.SetStateAction<string>>;
  setOldArea: React.Dispatch<React.SetStateAction<string>>;
  oldArea: string;
  OnUpdatePosition: (editPositon: editPositionSchemaTs, targetShip: string, targetArea: string) => Promise<void>;
  OnUpdateItem:  (updatedData: editItemSchemaTs) => Promise<void>;
  setTargetItemId: React.Dispatch<React.SetStateAction<string | null>>;
  OnDeleteItem: () => Promise<void>;
  OnDeletePosition: () => Promise<void>;
  setTargetShipToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  setTargetAreaToDelete: React.Dispatch<React.SetStateAction<string | null>>;
  setTargetPositionToDelete: React.Dispatch<React.SetStateAction<string | null>>; 
  checkedItems: string[]; 
  onToggleItem: (itemId: string) => void;  
}

// MUI List/List Control を参照
const CheckboxList = ({
  areaPosition, 
  currentListItems, 
  isSetting, 
  isAdd,
  isDelete,
  isEdit,
  open,
  setOpen,
  ship,
  areaName,
  onSaveAddPosition,
  setSettingFormShip,
  setSettingFormArea,
  setSettingFormPosition,
  onSaveAddItem,
  selectArea,
  setOldPosition,
  OnUpdatePosition,
  setOldArea,
  oldArea,
  OnUpdateItem,
  setTargetItemId,
  OnDeleteItem,
  OnDeletePosition,
  setTargetShipToDelete,
  setTargetAreaToDelete,
  setTargetPositionToDelete,
  checkedItems,
  onToggleItem,    
} : CheckboxListProps) => {

  const [checked, setChecked] = React.useState<string[]>([]);
  const [openAddFormL, setOpenAddFormL] = React.useState(false);
  const [positionName, setPositionName] = React.useState("");
  const [openEditFormM, setOpenEditFormM] = React.useState(false);
  const [openEditFormLL, setOpenEditFormLL] = React.useState(false);
  const [itemName, setItemName] = React.useState("");
  const [currentItemToEdit, setCurrentItemToEdit ] = React.useState<ListItems | null> (null);
  const [openDeleteItemForm, setOpenDeleteItemForm] = React.useState(false);
  const [openDeletePositionForm, setOpenDeletePositionForm] = React.useState(false);

  // aera別にpositionを抽出(CheckboxList生成用) *********************************************

  // 1.currentListItemsをareaごとに配列にして振り分ける
  const filteredItemsForCurrentArea = React.useMemo(() => {
    return currentListItems.filter(item => item.area === areaPosition);
  }, [areaPosition, currentListItems]);
  
  console.log("filteredItemsForCurrentArea:", filteredItemsForCurrentArea) 

  // 2.各areaのpositionを配列にまとめ、オブジェクトに格納（例: FWD: [position1,position2,position3,position1]）
  const currentPosition: {[key: string]: string[]} = filteredItemsForCurrentArea.reduce((acc: {[key: string]: string[]}, item: ListItems) => {
   if(!acc[item.area]) {
     acc[item.area] = []
   }
   acc[item.area].push(item.position);
   return acc
  }, {})
  
  console.log("currentPosition:",currentPosition);
  
  // 3.currentPositionから各areaのみを配列に格納する（後にmapで展開させるためにオブジェクトを配列に変更させておく）
  // (例: 0:["FWD"])
  const areas = Object.keys(currentPosition);
  console.log("areas:", areas);
  
  // 4.currentPositionから重複したpositionを解消する(例: FWD:[position1,position2,position3])
  const positionByArea = Object.fromEntries(
    Object.entries(currentPosition).map((([key, item]) => [key, [...new Set(item)]]))
  )
  console.log("positionByArea:", positionByArea);
  
  
  // アイテムのチェックを実行
  const handleToggle = (id: string) => () => {
    // const currentIndex = checked.indexOf(id);
    // const newChecked = [...checked];
    // console.log("currentIndex:", currentIndex);
    // if (currentIndex === -1) {
    //   newChecked.push(id);
    // } else {
    //   newChecked.splice(currentIndex, 1);
    // }
    
    // console.log("newChecked:", newChecked)
    // setChecked(newChecked);
    onToggleItem(id);
  };

  

  // dialogの開閉 *************************************************************

  const addPositionFormOpen = (position: string) => {
    setOpenAddFormL(true);
    setPositionName(position);
    setSettingFormShip(ship);
    setSettingFormArea(areaPosition);
    setSettingFormPosition(position);
    
  };

  const editPositionFormOpen = (position: string) => {
    setOpenEditFormM(true);
    setPositionName(position);
    setSettingFormShip(ship);
    setSettingFormArea(areaPosition);
    setSettingFormPosition(position);
    setOldPosition(position);
    setOldArea(areaPosition);
  }

  const editItemFormOpen = (item: ListItems) => {
    setOpenEditFormLL(true);
    // setItemName(item.name);
    setCurrentItemToEdit(item);
    setTargetItemId(item.id);
    
  }

  const deleteItemFormOpen = (item: ListItems) => {
    setOpenDeleteItemForm(true);
    setCurrentItemToEdit(item);
    setTargetItemId(item.id);
  }

  const deletePositionFormOpen = (position: string) => {
    setOpenDeletePositionForm(true);
    setTargetShipToDelete(ship);
    setTargetAreaToDelete(areaPosition);
    setTargetPositionToDelete(position);
    setPositionName(position);      
  }

  // SettingFormMの選択肢を作成  ***************************************************
  // (Gemini: MUI Select コンポーネントの作成を参照)

  const selectPositionByArea: {[key: string]: string[]} = React.useMemo(() => {
    const tempPositionMap: {[key: string]: Set<string>} = {};
    // ↑以下の状態を作成するための初期化
    // tempPositionMap = {
    //   "FWD": Set { "A350FwdComp1", "test-position2", "A350FwdComp2" },
    //   "MID": Set { "test-position", "A350MidComp2" },
    //   "AFT": Set { "A350AftComp1" }
    // };


    selectArea.forEach(area => {
      tempPositionMap[area] = new Set<string>();
    });

    currentListItems.forEach(item => {
      if(item.area && item.position && selectArea.includes(item.area)) {
        tempPositionMap[item.area].add(item.position);
      }  
    });

    const result: {[key: string]: string[]} = {};
    // ↑以下の状態を作成するための初期化
    // result = {
    //   "FWD": ["A350FwdComp1", "test-position2", "A350FwdComp2"],
    //   "MID": ["test-position", "A350MidComp2"],
    //   "AFT": ["A350AftComp1"]
    // };

    // ループしているプロパティ (areaKey) が、tempPositionMap自身のプロパティであり、
    // プロトタイプチェーンから継承されたものではないことを確認するための安全策。
    for (const areaKey in tempPositionMap) {
      if (Object.prototype.hasOwnProperty.call(tempPositionMap, areaKey)) {
        result[areaKey] = Array.from(tempPositionMap[areaKey]);
      }
    }
    return result;
    
  },[currentListItems, selectArea])

  console.log("selectPositionByArea:", selectPositionByArea)



  // SettingFormLLの選択肢を作成 ************************************************
 
    

  return (
    <>
    { areas.map((area, index) =>(
      <Box key={index}>
      {positionByArea[area]?.map((position) => ( 
      <Box>  
        <Box
          display={'flex'} 
          key={position}
          sx={{color: isSetting ? yellow[300] : grey[100], mt:3}} 
        >
         {isAdd ? (
           <IconButton 
             sx={{bgcolor: "#424242",color: "#2196f3", mr:1, p:0}}
             onClick={() => addPositionFormOpen(position)}
           >
               <AddCircleOutlineIcon sx={{mt: 0.5}}/>
           </IconButton>
         ): isDelete ? (
           <IconButton 
              sx={{bgcolor: "#424242",color: "#ff5722", mr:1, p:0}}
              onClick={() => deletePositionFormOpen(position)}
           >
               <DeleteIcon sx={{mt: 0.5}}/>
           </IconButton>
         ): isEdit ? (
           <IconButton 
             sx={{bgcolor: "#424242",color: "#00e676", mr:1, p:0}}
             onClick={() => editPositionFormOpen(position)}
           >
               <EditIcon sx={{mt: 0.5}}/>
           </IconButton>
          ): null    
         }
         <Typography sx={{fontSize: 20}}>
          {position}
         </Typography>
         
         {openAddFormL && positionName === position && (
            <SettingFormL
            open={openAddFormL}
            setOpen={setOpenAddFormL}
            ship={ship}
            area={areaPosition}
            position={position}
            onSaveAddItem={onSaveAddItem}
            />
         )}
         {openEditFormM && positionName === position && (
            <SettingFormM
            open={openEditFormM}
            setOpen={setOpenEditFormM}
            ship={ship}
            area={areaPosition}
            position={position}
            selectArea={selectArea}
            selectPositionByArea={selectPositionByArea}
            setOldPosition={setOldPosition}
            setOldArea={setOldArea}
            oldArea={oldArea} 
            OnUpdatePosition={OnUpdatePosition}  
            />
         )}        
        </Box>  
        
      <List sx={{ 
        width: '100%', 
        maxWidth: 800, 
        bgcolor: isSetting ? yellow[50] : 'background.paper' 
      }}>
      {filteredItemsForCurrentArea
       .filter((item) => item.position === position)
       .map((item) => {
        const labelId = `checkbox-list-label-${item.id}`;
        
        return (
          <ListItem
          key={item.id}
          // secondaryAction={
            //   <IconButton edge="end" aria-label="comments">
            //     <CommentIcon />
            //   </IconButton>
            // }
            disablePadding
            >
            <ListItemButton role={undefined} onClick={handleToggle(item.id)} dense>
              {isDelete ? (
                <ListItemIcon 
                  sx={{color: "#ff5722"}}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItemFormOpen(item);
                  }}  
                >
                  <DeleteIcon />
                </ListItemIcon>
               ): isEdit ? (
                <ListItemIcon 
                  sx={{color: "#00e676"}}
                  onClick={(e) => {
                    e.stopPropagation();
                    editItemFormOpen(item);
                  }}
                >
                  <EditIcon />
                </ListItemIcon>
               ) : (
                <ListItemIcon>
                   <Checkbox
                     edge="start"
                     checked={checkedItems.includes(item.id)}
                     tabIndex={-1}
                     disableRipple
                     inputProps={{ 'aria-labelledby': labelId }}
                     />
                </ListItemIcon>
              )}
              <ListItemText 
                 id={labelId} 
                 primary={`${item.name}`}
                 sx={{color: grey[900]}} 
                 />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
    </Box>
     ))}
     </Box>
    ))}
    <SettingFormS
      open={open}
      setOpen={setOpen}
      ship={ship}
      area={areaName}
      onSaveAddPosition={onSaveAddPosition} 
    />

      { openEditFormLL && currentItemToEdit && (
            <SettingFormLL
              open={openEditFormLL}
              setOpen={setOpenEditFormLL}
              ship={currentItemToEdit.ship}
              area={currentItemToEdit.area}
              position={currentItemToEdit.position}
              itemName={currentItemToEdit.name}
              itemNumber={currentItemToEdit.number}
              itemStartDate={currentItemToEdit.startDate}
              itemEndDate={currentItemToEdit.endDate}
              selectArea={selectArea}
              selectPositionByArea={selectPositionByArea}
              setOldPosition={setOldPosition}
              setOldArea={setOldArea}
              oldArea={oldArea} 
              OnUpdateItem={OnUpdateItem}
            />
      )}

      { openDeleteItemForm && currentItemToEdit && (
            <DeleteFormItem
              open={openDeleteItemForm}
              setOpen={setOpenDeleteItemForm}
              ship={currentItemToEdit.ship}
              area={currentItemToEdit.area}
              position={currentItemToEdit.position}
              itemName={currentItemToEdit.name}
              OnDeleteItem={OnDeleteItem}
            />
      )}

      { openDeletePositionForm && (
            <DeleteFormPosition
              open={openDeletePositionForm}
              setOpen={setOpenDeletePositionForm}
              ship={ship}
              area={areaPosition}
              position={positionName}
              OnDeletePosition={OnDeletePosition}
              
            />
      )}   
    
    
    
      
    </>
  );
}


export default CheckboxList