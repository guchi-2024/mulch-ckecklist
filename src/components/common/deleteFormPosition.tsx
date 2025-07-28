import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';


interface DeleteFormPositionProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ship: string;
  area: string;
  position: string;
  OnDeletePosition: () => Promise<void>;  
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
    backgroundColor: '#fff9c4',
    width: '50%',
    maxWidth: 'none',
    height: '40vh'

  },
}));

export default function DeleteFormPosition({
  open,
  setOpen,
  ship,
  area,
  position,
  OnDeletePosition,   
}: DeleteFormPositionProps) {

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await OnDeletePosition();
    handleClose();
  }

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
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {ship} {area} 
        </DialogTitle>
        
        <DialogContent dividers>

        <Box>
          <Typography>
            「<strong>{position}</strong>」<Box component="span" sx={{ color: 'blue' }}>を削除しますか？</Box>
          </Typography>
          
          <Box sx={{mt: 2, color: 'red'}} display={"flex"}>
          <WarningIcon sx={{pb: 0}}/> 
          <Box>「<strong>{position}</strong>」に属しているアイテムも削除されます。</Box>
          </Box>
          
        </Box>

        </DialogContent>
       
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
            onClick={handleDelete}
            autoFocus 
            sx={{
              color: '#f44336',
              backgroundColor: '#64ffda',
              border: '1px solid',
              borderColor: '#00c853',
              '&:hover': {
                backgroundColor: '#00bfa5',
                color: '#f5f5f5'
              }             
            }}
          >
            削除
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
