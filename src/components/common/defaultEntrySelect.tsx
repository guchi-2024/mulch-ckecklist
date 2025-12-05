import { Box, Divider, List, ListItemButton, Typography } from '@mui/material'
import { grey, blue, blueGrey, common, lime} from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FlightShip } from '../../types';


interface flightListSelectProps {
  flight: FlightShip['flights'][0];
  onEditClick: () => void;
  onDeleteFlight: (flightId: string | undefined) => Promise<void>; 
}

const DefaultEntrySelect = ({ 
  flight, 
  onEditClick,
  onDeleteFlight, 
}: flightListSelectProps) => {


  return (
    <Box
      sx={{
        color: grey[900],
        bgcolor: lime[100],
        minHeight: 102, // 高さを動的に変更可能にする
        width: 600,
        ml: 5, mb: 1,
        display: 'flex',
        alignItems: 'center', 
        borderRadius: "4px",
        border: '2px solid #546e7a',
        p: 1, 
        position: 'relative',
      }}
    >
      
  
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box 
            sx={{ 
              width: 100,
              height: 80,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Box>  
              <Typography sx={{color: grey[500]}}>No</Typography>
            </Box>
            <Box>
              <Typography component="span" sx={{ fontSize: 20 }}>
                {flight.No}
              </Typography>
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ borderRight: '2px solid #cfd8dc' }} />  

          <Box 
            sx={{ 
              width: 220,
              height: 80,
              pl: 1,
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
          p: 2, 
        }}
      >
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
      </Box>

    </Box>    
  
    )
}  


export default DefaultEntrySelect;



