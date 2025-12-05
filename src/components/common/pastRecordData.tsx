import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, List } from '@mui/material';
import { styled } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useState } from 'react'
import PastRecordTransfer from './pastRecordTransfer';
import ONflightRecord from './ONflightRecord';
import { RecordDays, TransferRecord } from '../../types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';


interface PastRecordDataProps {
  date: string;
  onColse: () => void;
  transferRecordDatas: TransferRecord[];
  recordDays: RecordDays[];
  setRecordDays: React.Dispatch<React.SetStateAction<RecordDays[]>>;
}
const PastRecordData  = ({
  date,
  onColse,
  transferRecordDatas,
  recordDays,
  setRecordDays,
}: PastRecordDataProps) => {

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
      overflowY: 'auto'
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },   
    '& .MuiDialog-paper': {
      backgroundColor: '#b3e5fc',
      width: '75%',
      maxWidth: 'none',
      height: '100vh',
      border: '3px solid #607d8b',
    },
  }));
  
  
  
  // fireStoreからその日のrecordDaysを取得
  useEffect(() => {
    const fetchRecordDays = async () => {
      try {
        const recordDaysRef = collection(db, 'recordDays');
        const q = query(recordDaysRef, where("day", "==", date));
        const querySnapshot = await getDocs(q);
        const dataList: RecordDays[] = querySnapshot.docs.map((doc) => {
          return doc.data() as RecordDays;
        });
        // Noに沿って昇順に並び替える
        dataList.sort((a, b) => a.No - b.No);
        setRecordDays(dataList);
      } catch (error) {
        console.error("fetchRecordDaysにエラーが発生しました:", error);      
      }
    };
    fetchRecordDays();
  }, [date]);

  // 日付表示を変更
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1; 
  const day = dateObj.getDate();
  const displayDate = `${month}月${day}日`;

  const recordsOnTheDate = transferRecordDatas.filter((flight) => {
    return flight.day === date;
  });
    

  const uniqueTransferRecords = recordsOnTheDate.filter((flight, index, self) => {
    const firstIndex = self.findIndex((t) => (
      t.ARR === flight.ARR && t.day === flight.day
    ));
    return index === firstIndex;
  });
  console.log("uniqueTransferRecords:", uniqueTransferRecords);
  


  return (
    <BootstrapDialog
      onClose={onColse}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <Box sx={{display: "flex", justifyContent: "space-between"}}>
        <DialogTitle sx={{ fontSize: '24px', fontWeight: 'bold' }}>
          {displayDate}
        </DialogTitle>
        <Button 
          aria-label="close" 
          onClick={onColse}
          sx={{
            color: '#616161',
            height: '50%',
            mt: 1
          }}
        >
          <CancelIcon/>
        </Button>
      </Box>

      <Divider sx={{ borderBottom: '2px solid #b0bec5' }} />

      <DialogTitle 
        sx={{ fontSize: '20px',
              fontWeight: 'bold' , 
              pb:0, pl:1,
        }}
      >
          ・伝達事項
      </DialogTitle>
        <List>
          {uniqueTransferRecords.map((flight, id) => (
            <PastRecordTransfer
              key={id}
              transferRecordDatas={transferRecordDatas}
              dateFlightRecord={flight}
            />
            )
          )}
          {/* <PastRecordTransfer
            transferRecordDatas={transferRecordDatas}
          /> */}
        </List>

      <DialogTitle sx={{ fontSize: '20px', fontWeight: 'bold', pb:0, pl:1}}>
          ・O/N便
      </DialogTitle>
        <List>
          {recordDays.map((flight, index) => (
            <ONflightRecord
              key={index}
              record={flight}
            />  
          ))}
        </List>  



    </BootstrapDialog>

  );
}

export default PastRecordData;


