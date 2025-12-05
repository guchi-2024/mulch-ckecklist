import { Box, Divider, Typography } from '@mui/material'
import { blueGrey, pink } from '@mui/material/colors'
import React from 'react'
import { TransferRecord } from '../../types';
import { date } from 'zod';

interface PastRecordTransferProps {
  dateFlightRecord: TransferRecord;
  transferRecordDatas: TransferRecord[];
}


const PastRecordTransfer = ({
  dateFlightRecord,
  transferRecordDatas,
}: PastRecordTransferProps) => {

  const matchingRecords = transferRecordDatas.filter((record) =>(
    record.ARR === dateFlightRecord.ARR
    && record.day === dateFlightRecord.day
  ));


  return (
    <Box
        sx={{
          flexGrow: 1, // 残りのスペースを全て占める
          minHeight: 86, // 最小高さを設定
          border: '1px solid #78909c',
          borderRadius: "4px",
          mx: 1, // 左右のマージン
          mb: 0.5,
          p: 1, // 内部のパディング
          display: 'flex',
          flexDirection: 'column',
          bgcolor: blueGrey[50],

        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
  
          <Box 
            sx={{ 
              width: 220,
              height: 30,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Box>
              <Typography component="span" sx={{fontSize: 25 }}>
                {/* {flight.ARR} */}
                {dateFlightRecord.ARR}/
              </Typography>
              <Typography component="span" sx={{fontWeight: "fontWeightBold",fontSize: 25}}>
                {/* {flight.DEP ? `/${flight.DEP}` : ''} */}
                {dateFlightRecord.DEP}&ensp;&#40;{dateFlightRecord.shipNo}&#41;
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ borderBottom: '2px solid #90a4ae' }} />
               
        {/* 下段のメモ部分 */}       
        <Box sx={{ mt: 1}}>
          {matchingRecords.map((record, index)=> (
            record.memo ? (
              <Box 
                key={index} 
                sx={{
                color: pink[500],
                fontWeight: "fontWeightBold",
                display: 'flex',
                mb: 0.5,
                }}
              >
                <Typography sx={{mr:1}}>・</Typography>
                <Typography 
                  sx={{
                    fontWeight: "fontWeightBold",
                    fontSize: 20,
                  }}
                >
                    {record.memo}
                </Typography>
              </Box>  
            ) : null            
          ))}
        </Box>
    </Box>
  )
}

export default PastRecordTransfer
