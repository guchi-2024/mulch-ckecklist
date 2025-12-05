import React from 'react'
import Calendar from '../components/common/calendar'
import { Box } from '@mui/material'
import { TransferRecord } from '../types';
import RecordCalendar from '../components/common/calendar';
import { record } from 'zod';

interface PersonalRecordProps {
  transferRecordDatas: TransferRecord[];
}


const PersonalRecord = ({
  transferRecordDatas,
}:PersonalRecordProps) => {
  return (
    <Box sx={{p: 2}}>
      <RecordCalendar
        transferRecordDatas={transferRecordDatas}
      />
    </Box>
  
  )
}

export default PersonalRecord
