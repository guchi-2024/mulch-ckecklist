import { Box, Divider, List, ListItemButton, Typography } from '@mui/material'
import { grey, blue, blueGrey, common, pink} from '@mui/material/colors';
import TaskIcon from '@mui/icons-material/Task';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FlightShip, MenuList, TransferRecord } from '../../types';
import { useNavigate } from 'react-router-dom';
import AirplanemodeInactiveIcon from '@mui/icons-material/AirplanemodeInactive';
import { useState } from 'react';

interface flightListSelectProps {
  flight: FlightShip['flights'][0];
  menuListBase: Omit<MenuList, 'ARR' | 'DEP' | 'shipNo'>[];
  onEditClick: () => void;
  currentFlights: FlightShip[];
  defaultFlights: FlightShip[];
  onDeleteFlight: (flightId: string | undefined) => Promise<void>;
  completedARRs: string[];
  setCompletedARRs: React.Dispatch<React.SetStateAction<string[]>>; 
  transferRecordDatas: TransferRecord[]; 
}

const FlightListSelect = ({ 
  flight, 
  menuListBase, 
  onEditClick,
  currentFlights,
  defaultFlights,
  onDeleteFlight,
  completedARRs,
  setCompletedARRs,
  transferRecordDatas, 
}: flightListSelectProps) => {

  const shipNavigate = useNavigate();

  const [isCancelled, setIsCancelled] = useState(false);

  const isCompleted = completedARRs.includes(flight.ARR);


  const handleListClick = (currentFlight: FlightShip['flights'][0]) => {
    const baseList = menuListBase.find(list => list.shipName === currentFlight.ship);

    if(baseList) {
      const menuList: MenuList = {
        ...baseList,
        ARR: currentFlight.ARR,
        DEP: currentFlight.DEP,
        shipNo: currentFlight.shipNo
      }
      console.log("生成されたMenuItem:", menuList);
      shipNavigate(menuList.path, {state: menuList})
    }
  };

  // キャンセルアイコンのクリックハンドラ
  const handleCancelClick = () => {
    setIsCancelled(!isCancelled);
  };

  const hasARRValue = (flights: FlightShip[], arrValue: string) => {
    return flights.some(company =>
      company.flights.some(flight =>
        flight.ARR === arrValue
      )
    );
  };

  const matchingRecords = transferRecordDatas.filter(record => record.ARR === flight.ARR);




  return (
    <Box
      sx={{
        color: grey[900],
        bgcolor: blueGrey[100],
        minHeight: 102, // 高さを動的に変更可能にする
        width: 640,
        ml: 5, mb: 1,
        display: 'flex',
        alignItems: 'center', 
        borderRadius: "4px",
        border: '2px solid #546e7a',
        p: 1, 
        position: 'relative',
      }}
    >
      {/* 左側のTaskIcon部分 */}
      {!isCancelled ? (
        <ListItemButton
          onClick={() => handleListClick(flight)}
          sx={{
            height: '100%', // 親の高さに合わせる
            width: 10,
            p: 0, // ボタンのパディングをなくす
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TaskIcon
            sx={{
              fontSize: 40,
              color: blue[900],
              '&:hover': {
                color: '#29b6f6', 
              }
            }}
          />
        </ListItemButton>
      ) : (
        // FLT CNLの時、形状を崩さないために空の要素を配置
        <ListItemButton
          sx={{
            height: '100%', // 親の高さに合わせる
            width: 10,
            p: 0, // ボタンのパディングをなくす
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
        </ListItemButton>
      )}
  
      {/* 中央のメインコンテンツ部分 */}
      <Box
        sx={{
          flexGrow: 1, // 残りのスペースを全て占める
          minHeight: 86, // 最小高さを設定
          border: '1px solid #78909c',
          borderRadius: "4px",
          mx: 1, // 左右のマージン
          p: 1, // 内部のパディング
          display: 'flex',
          flexDirection: 'column',
          bgcolor: blueGrey[50],
  
        }}
      >
        {/* 上段のデータ部分 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
  
          <Box 
            sx={{ 
              width: 220,
              height: 80,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Box>  
              <Typography sx={{color: grey[500]}}>ARR/DEP</Typography>
            </Box>
            <Box>
              <Typography component="span" sx={{ fontWeight: "fontWeightBold", fontSize: 35 }}>
                {flight.ARR}
              </Typography>
              <Typography component="span" sx={{fontSize: 20}}>
                {flight.DEP ? `/${flight.DEP}` : ''}
              </Typography>
            </Box>
            
          </Box>
  
          <Divider orientation="vertical" flexItem sx={{ borderRight: '2px solid #cfd8dc' }} />
  
          <Box 
            sx={{ 
              pl: 1,
              pb: 0.5,
              width: 150, 
              height: 80,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Typography sx={{color: grey[500]}}>Ship Type</Typography>       
            <Typography component="span" sx={{fontSize: 20}}>{flight.ship}</Typography>
          </Box>
  
          <Divider orientation="vertical" flexItem sx={{ borderRight: '2px solid #cfd8dc' }} />
  
          <Box 
            sx={{ 
              pl: 1,
              pb: 0.5,
              width: 70, 
              height: 80,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Typography sx={{color: grey[500]}}>Ship No</Typography>
            <Typography component="span" sx={{fontSize: 20}}>{flight.shipNo}</Typography>
          </Box>
        </Box>
        
        <Divider sx={{ borderBottom: '2px solid #cfd8dc' }} />
        
        {/* 下段のメモ部分 */}
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{color: grey[500]}}>
            伝達事項：
          </Typography>
          {matchingRecords.length > 0 ? ( 
            matchingRecords.map((record, index)=> (
              <Box 
                key={index} 
                sx={{
                  color: pink[500],
                  fontWeight: "fontWeightBold",
                  fontSize: 20,
                }}
              >
                ・{record.memo}
              </Box>
            )) 
          ) : ( 
            <Typography variant="body2">
              なし<br/>
            </Typography>  
          )}
        </Box>
      </Box>
  
      {/* 右側のアイコン部分 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1, // アイコン間のスペース
          p: 2, // パディング
        }}
      >
        {!isCancelled && (
          <EditIcon
            onClick={onEditClick} 
            sx={{
              fontSize: 35, 
              color: "#00c853", 
              border: '1px, solid, #00c853',
              borderRadius: '5px',
              p: 0.5,
              '&:hover': {
                bgcolor: '#00c853', 
                color: '#e0f2f1'
              }
            }}/>
        )}

        {hasARRValue(defaultFlights, flight.ARR)?( 
          <AirplanemodeInactiveIcon
            onClick={handleCancelClick}
            sx={{
              mt:2, 
              fontSize: 35, 
              color: "#ff5722",
              border: '1px, solid, #ff5722',
              borderRadius: '5px',
              p: 0.5,
              '&:hover': {
                bgcolor: '#ff5722', 
                color: '#fbe9e7'
              }
            }}
          />) : (
          <DeleteIcon
            onClick={() => onDeleteFlight(flight.id)} 
            sx={{
              mt:2, 
              fontSize: 35, 
              color: "#ff5722",
              border: '1px, solid, #ff5722',
              borderRadius: '5px',
              p: 0.5,
              '&:hover': {
                bgcolor: '#ff5722', 
                color: '#fbe9e7'
              }
          }}/>
        )}

      </Box>
      {isCancelled && (
      <Box
        sx={{
          width: '40%',
          height: '40%',
          color: '#ff5722',
          opacity: 0.6,
          fontSize: 50,
          fontWeight: "fontWeightBold",
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '5px',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        FLT CNL
      </Box> 
      )}
      
      {isCompleted && (
      <Box
        sx={{
          width: '40%',
          height: '40%',
          color: '#00c853',
          opacity: 0.3,
          fontSize: 50,
          fontWeight: "fontWeightBold",
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '5px',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        COMPLETE
      </Box>
      )}
    </Box>    
  
    )
}  


export default FlightListSelect;



