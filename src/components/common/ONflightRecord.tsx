import { Box, Divider, Typography } from '@mui/material'
import { blueGrey, grey, pink } from '@mui/material/colors'
import React from 'react'
import { RecordDays } from '../../types'

interface ONflightRecordProps {
  record: RecordDays;
}


const ONflightRecord = ({record}: ONflightRecordProps) => {

  const getMemoColor = (memo: string | undefined): string => {
    if(!memo) {
      return 'text.primary';
    }
    switch(memo) {
      case "チェック完了":
        return '#00c853';
      case "申し送りあり":
        return 'blue';   
      case "欠航":
        return '#f57c00'; 
      case "未完了":
        return 'red';    
      default:
        return 'text.primary';  
    }
  };
  const memoColor = getMemoColor(record.memo);





  return (
    <Box
        sx={{
          flexGrow: 1, // 残りのスペースを全て占める
          minHeight: 40, // 最小高さを設定
          border: '1px solid #78909c',
          borderRadius: "4px",
          mx: 1, mb: 0.5,// 左右のマージン
          p: 1, // 内部のパディング
          display: 'flex',
          bgcolor: blueGrey[50],
  
        }}
      >
      <Box sx={{ width: 160, height: 20,}}>
        <Box>
          <Typography component="span" sx={{fontSize: 16, fontWeight: "fontWeightBold" }}>
            {record.ARR}/
          </Typography>
          <Typography component="span" sx={{fontSize: 16, fontWeight: "fontWeightBold"}}>
            {/* {flight.DEP ? `/${flight.DEP}` : ''} */}
            {record.DEP}&ensp;&#40;{record.shipNo}&#41;
          </Typography>
        </Box>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ borderRight: '2px solid #cfd8dc' }}/>

      <Box sx={{ width: 120, height: 20,}}>
        <Typography component="span" sx={{fontSize: 15, fontWeight: "fontWeightBold", pl:2 }}>
          {record.responsiblePerson}
        </Typography>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ borderRight: '2px solid #cfd8dc' }} /> 

      <Box>
        <Typography 
          component="span" 
          sx={{
            fontSize: 15, 
            fontWeight: "fontWeightBold", 
            pl:2,
            color: memoColor, 
        }}>
          {record.memo? record.memo : ''}
        </Typography>
      </Box>  
    </Box>
      
  )
}

export default ONflightRecord
