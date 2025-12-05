import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box, Divider, InputAdornment, ListItem, ListItemText, MenuItem, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransferRecord } from '../types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';



interface TransferProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ship: string;
  area: string;
  position: string;
  itemName: string;
  ARR: string | undefined;
  DEP: string | undefined;
  shipNo: string | undefined;
  transferRecordDatas: TransferRecord[];
  setTransferRecordDatas: React.Dispatch<React.SetStateAction<TransferRecord[]>>;

  // selectArea: string[];
  // selectPositionByArea: {[key: string]: string[]}
  // setOldPosition: React.Dispatch<React.SetStateAction<string>>
  // setOldArea: React.Dispatch<React.SetStateAction<string>>;
  // oldArea: string;
  // itemNumber: number;
  // itemStartDate: string;
  // itemEndDate: string;
  // OnUpdateItem: (updatedData: editItemSchemaTs) => Promise<void>;
}

// MUI Dailog Customization を参照
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
    backgroundColor: '#e1f5fe',
    width: '75%',
    maxWidth: 'none',
    height: '100vh',
    border: '3px solid #607d8b',
    borderRadius: '5px'
  },
}));

export default function Transfer({
  open,
  setOpen,
  ship,
  area,
  position,
  itemName,
  ARR,
  DEP,
  shipNo,
  transferRecordDatas,
  setTransferRecordDatas,
}: TransferProps) {

  const [memo, setMemo] = React.useState("");


  // 入力した伝達事項をfireStore(transferRecord)に保存　*********************************
  const handleTransferRecording = async () => {
    // 現在の日付を「yyyy-MM-dd」形式で取得する
    const today = new Date();
    const dayString = today.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-'); // 2025/11/18 -> 2025-11-18 に変換
    // 新しい TransferRecord オブジェクトを作成する
    const newRecord: TransferRecord = {
      ARR: ARR || '',
      DEP: DEP || '',
      shipNo: shipNo || '',
      area: area,
      position: position,
      name: itemName,
      memo: memo,
      day: dayString,
    }
    try {
      const docRef = await addDoc(collection(db, "transferRecord"), newRecord);
      console.log("新しい伝達記録をFirestoreに保存。Document ID:", docRef.id)
    } catch(e) {
      console.error("Firestoreへの書き込みエラーが発生しました: ", e);
    }
    // 既存の記録リストに新しい記録を追加して、状態を更新する
    // setTransferRecordDatas((prevRecords) => [...prevRecords, newRecord]);
    handleClose();
  }
  console.log("transferRecordDatas:", transferRecordDatas);


  const handleClose = () => {
    setOpen(false);
  };


  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '1.5rem' }} id="customized-dialog-title">
          {ARR}/{DEP}&emsp;{ship}【{shipNo}】
        </DialogTitle>

        <Divider sx={{ borderBottom: '2px solid #cfd8dc' }} />

        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {area} &emsp; {position} 
        </DialogTitle>

        <Divider sx={{ borderBottom: '1px solid #cfd8dc' }} />

        <DialogTitle 
          sx={{ backgroundColor: '#fffde7', 
                fontSize: '1.0rem', 
                color: '#1976d2' 
          }} 
          id="customized-dialog-title"
        >
          「{itemName}」に対して伝達事項を入力してください。
        </DialogTitle>
        
        <DialogContent sx={{backgroundColor: '#fffde7'}}>
          
            {/* アンケート用紙（入力フォーム）の記述 */}
            <TextField
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              sx={{mt:2}}
              // フォームのラベル（見出し）
              label="伝達事項（100文字まで）"
              // 入力欄を大きくして、複数行入力できるようにする
              multiline 
              // 入力行の目安
              rows={4} 
              // 幅を最大にする
              fullWidth 
              // 最も重要な文字数制限の設定！
              inputProps={{ 
                maxLength: 100 // 「最大100文字まで」という設定をしています
              }}
              slotProps={{
                input: {
                  sx: {
                    backgroundColor: '#fafafa',
                    '&:hover': {
                      backgroundColor: '#fafafa',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fafafa',
                    }, 
                  }
                }
              }}
            />

       
        </DialogContent>

        <Divider sx={{ borderBottom: '1px solid #cfd8dc' }} />
       
        <DialogActions>
          <Button
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              color: theme.palette.grey[700],
              backgroundColor: '#f8bbd0',
              border: '1px solid',
              borderColor: theme.palette.error.main,
              '&:hover': {
                backgroundColor: '#e91e63',
                color: '#f5f5f5'
              }             
            })}
          >
            キャンセル
          </Button>
          <Button 
            onClick={handleTransferRecording}
            autoFocus 
            sx={{
              color: '#1976d2',
              backgroundColor: '#64ffda',
              border: '1px solid',
              borderColor: '#00c853',
              '&:hover': {
                backgroundColor: '#00bfa5',
                color: '#f5f5f5'
              }             
            }}
          >
            決定
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
