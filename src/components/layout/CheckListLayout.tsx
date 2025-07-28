// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { Box, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { blue, blueGrey, grey, yellow } from '@mui/material/colors';
import { CSSProperties, useMemo, useState } from 'react';
import { NavLink,useLocation } from 'react-router-dom';
import CheckboxList from '../common/CheckboxList';
import { ListItems, MenuItem } from '../../types';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addItemSchemaTs, addPositionSchemaTs, editItemSchemaTs, editPositionSchemaTs } from '../../validations/schema';
import { AreaCheckStatus } from '../../App';


interface CheckListLayoutProps {
  listItems: ListItems[];
  isSetting: boolean;
  isAdd: boolean;
  isDelete: boolean;
  isEdit: boolean;
  onSaveAddPosition: (addPosition: addPositionSchemaTs) => Promise<void>;
  setSettingFormShip: React.Dispatch<React.SetStateAction<string>>;
  setSettingFormArea: React.Dispatch<React.SetStateAction<string>>;
  setSettingFormPosition: React.Dispatch<React.SetStateAction<string>>;
  onSaveAddItem: (addItem: addItemSchemaTs) => Promise<void>
  setOldPosition: React.Dispatch<React.SetStateAction<string>>;
  setOldArea: React.Dispatch<React.SetStateAction<string>>;
  oldArea: string;
  OnUpdatePosition: (editPositon: editPositionSchemaTs, targetShip: string, targetArea: string) => Promise<void>;
  OnUpdateItem:  (updatedData: editItemSchemaTs) => Promise<void>;
  setTargetItemId: React.Dispatch<React.SetStateAction<string | null>>;
  OnDeleteItem: () => Promise<void>;
  OnDeletePosition: () => Promise<void>;
  setTargetShipToDelete: React.Dispatch<React.SetStateAction<string | null>>
  setTargetAreaToDelete: React.Dispatch<React.SetStateAction<string | null>>
  setTargetPositionToDelete: React.Dispatch<React.SetStateAction<string | null>>
  currentDateTimeFormatted: string;
  areaCheckStatus: AreaCheckStatus;
  checkedItems: string[]; 
  onToggleItem: (itemId: string) => void; 
 }


const CheckListLayout = ({
  listItems, 
  isSetting, 
  isAdd,
  isDelete,
  isEdit,
  onSaveAddPosition,
  setSettingFormShip,
  setSettingFormArea,
  setSettingFormPosition,
  onSaveAddItem,
  setOldPosition,
  setOldArea,
  oldArea,
  OnUpdatePosition,
  OnUpdateItem,
  setTargetItemId,
  OnDeleteItem,
  OnDeletePosition,
  setTargetShipToDelete,
  setTargetAreaToDelete,
  setTargetPositionToDelete,
  currentDateTimeFormatted,
  areaCheckStatus,
  checkedItems,
  onToggleItem,
}: CheckListLayoutProps) => {

  const [open, setOpen] = useState(false);
  const [shipName, setShipName] = useState("");
  const [areaName, setAreaName] = useState("");

  const location = useLocation();
  const ship = location.state as MenuItem

  console.log("ship:", ship);

  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  }
  // menuItemsから選択されたshipのtext(機種名)とlistItemsのship(機種名)が一致したものをフィルター
  // listItems または ship が変更された時のみフィルタリングを行う
  const currentListItems = useMemo(() => {
    const filteredList = listItems.filter((name) => {
      return name.ship === ship.text;
    });
    console.log("filteredList:", filteredList); // フィルタリング時のみログ出力
    return filteredList;
  }, [ship, listItems]); // 依存配列に ship を追加

  console.log("listItems:",listItems);
  console.log("currentListItems:",currentListItems);
  
  // dialogの開閉
  const addAreaFormOpen = (area: string) => {
    setOpen(true);
    setShipName(ship.text);
    setAreaName(area);
    console.log("area:", area );
    setSettingFormShip(ship.text);
    setSettingFormArea(area);
  };
  
  // レイアウト設定

  // サイドバーの固定幅を定義
  const SIDEBAR_WIDTH = '125px';
  // ヘッダーの高さも固定しておく（サイドバーのtopとメインコンテンツのpaddingTop/marginTopに使うため）
  const APP_BAR_HEIGHT = '64px'; // AppBarのデフォルト高さ
  

  return (
    <>
    {/* ヘッダー */}
    <AppBar
        position="fixed"
        sx={{
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
          // ml: { sm: `${drawerWidth}px` },
          bgcolor: "#424242",
          color: "#f5f5f5",
          height: APP_BAR_HEIGHT,
          pl: 3,
          pr: 3,
        }}
      >
    <Toolbar disableGutters>
      <NavLink to={"/"}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        // onClick={handleDrawerToggle}
        sx={{ mr: 2, pt: 1.5 }}
      >
        <ArrowBackIosIcon style={{fontSize: "25px", color: blue[300]}}/>
      </IconButton>
      </NavLink>
      <Typography 
        variant="h4" 
        noWrap 
        component="div" 
        fontWeight="fontWeightBold"
        sx={{color: isSetting ? yellow[300] : grey[100]}}
      >
        {isSetting ? "設定モード　" : null}
        {ship.text}
      </Typography>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{ml: 'auto', color: grey[100]}}
      >
        {currentDateTimeFormatted}
      </Typography>      
    </Toolbar>
    </AppBar>
    {/* コンテンツ全体を囲むBox。ヘッダーの分だけ下にずらす */}
    <Box sx={{ display: 'flex', paddingTop: APP_BAR_HEIGHT }}> {/* ヘッダーの高さ分、下げる */}
      {/* 左サイドバー */}
        <Box
          sx={{
            position: 'fixed', // ビューポートに対して固定
            top: APP_BAR_HEIGHT, // ヘッダーの下から開始
            left: 0,           // 左端に配置
            width: SIDEBAR_WIDTH,    // サイドバーの幅を固定
            height: `calc(100vh - ${APP_BAR_HEIGHT})`, // ビューポートの残り全高に設定
            bgcolor: "#37474f",
            color: grey[100],
            overflowY: 'auto', // サイドバーの内容が溢れたらスクロール
            zIndex: 1000,      // ヘッダーより低いが、メインコンテンツより高い
            borderRight: 3,
            borderColor: grey[900],
          }}          
        >
          <List>
            { ship.areaBtn.map((area, index) => {
              const status = areaCheckStatus[ship.text]?.[area];
              const remaining = status ? status.total - status.checked : 0;
              const total = status ? status.total : 0;
              return (
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
                      }
                      secondary={
                        <Typography
                          sx={{
                            fontsize: 25,
                            color: 'red',
                            fontWeight: 'bold'
                          }}
                        >
                          { remaining === 0 ? 
                           <Box component="span" sx={{ color: '#1de9b6' }}>　完了</Box> 
                           : `残り: ${remaining} / ${total}`
                          }
                        </Typography>
                      }
                        
                    />   
                  </ListItemButton>
                </ListItem>
              </NavLink>
              )  
           })}
          </List>  
        </Box>


      {/* メイン */}
        <Box 
          component="main"
          sx={{
            flexGrow: 1, // 残りのスペースを全て占める
            marginLeft: SIDEBAR_WIDTH, // サイドバーの幅と同じマージンを設定
            width: `calc(100% - ${SIDEBAR_WIDTH})`, // サイドバーの幅を引いた残りの幅
            minHeight: `calc(100vh - ${APP_BAR_HEIGHT})`, // ヘッダーの高さ分を引いた残り
            bgcolor: "#424242",
            pr: 3, pl: 3,
            overflowY: 'auto', // メインコンテンツがはみ出たらスクロール
          }}
        >
        { ship.areaBtn.map((areaPosition, index) => (
        <Box
         key={index}
         sx={{pb: 12, pt: index === 0 ? 0 : undefined}}
        >
          <Box         
           sx={{
            display: 'flex',
            pt: 0,
            alignItems: 'center',
            borderBottom: 2,
            borderColor: '#cfd8dc'
           }}
          >
            {isAdd ? 
            <IconButton 
              sx={{bgcolor: "#424242",color: "#2196f3"}}
              onClick={() => addAreaFormOpen(areaPosition)}
            >
                <AddCircleOutlineIcon sx={{mt: 0.5}}/>
            </IconButton>
            : null}
            <Typography
              variant="h4" 
              noWrap 
              component="div" 
              fontWeight="fontWeightBold"
              color='white'
              sx={{
                color: isSetting ? yellow[300] : grey[100], 
              }}
            >   
              {areaPosition}
            </Typography>
          </Box> 
            <CheckboxList
            areaPosition = {areaPosition}
            currentListItems = {currentListItems}
            isSetting = {isSetting}
            isAdd={isAdd}
            isDelete={isDelete}
            isEdit={isEdit}
            open={open}
            setOpen={setOpen}
            ship={ship.text}
            selectArea={ship.areaBtn}
            areaName={areaName}
            onSaveAddPosition={onSaveAddPosition}
            setSettingFormShip={setSettingFormShip}
            setSettingFormArea={setSettingFormArea}
            setSettingFormPosition={setSettingFormPosition}
            onSaveAddItem={onSaveAddItem}
            setOldPosition={setOldPosition}
            setOldArea={setOldArea}
            oldArea={oldArea} 
            OnUpdatePosition={OnUpdatePosition}
            OnUpdateItem={OnUpdateItem}
            setTargetItemId={setTargetItemId}
            OnDeleteItem={OnDeleteItem}
            OnDeletePosition={OnDeletePosition}            
            setTargetShipToDelete={setTargetShipToDelete}
            setTargetAreaToDelete={setTargetAreaToDelete}
            setTargetPositionToDelete={setTargetPositionToDelete}
            checkedItems={checkedItems}
            onToggleItem={onToggleItem}                  
            />      
        </Box>  
        ))
        }   
        </Box>
    </Box>
    </>
  )
}

export default CheckListLayout

