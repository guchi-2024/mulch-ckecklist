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
import { Box, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addPositionSchema, addPositionSchemaTs } from '../../validations/schema';

interface SettingFormSProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ship: string;
  area: string;
  onSaveAddPosition: (addPosition: addPositionSchemaTs) => Promise<void>;
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

export default function SettingFormS({
  open,
  setOpen,
  ship,
  area,
  onSaveAddPosition,
}: SettingFormSProps) {

  const handleClose = () => {
    setOpen(false);
  };

  const { 
    control, 
    handleSubmit, 
    formState:{errors},
    reset 
  } = useForm<addPositionSchemaTs>({
    defaultValues: {position: ""},
    resolver: zodResolver(addPositionSchema)
  });



  const onsubmit: SubmitHandler<addPositionSchemaTs> = (data) => {
    console.log("data:", data);
    onSaveAddPosition(data);
    reset();
    handleClose();
  };

  console.log("resolver error:", errors)

  

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

        <Box
          component="form"
          onSubmit={handleSubmit(onsubmit)}
          sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          mt: 2,
          }}
        >
          <Typography sx={{color: '#1976d2', fontSize: "15px"}}>
            追加するポジション名を入力してください
          </Typography>

          {/* MUI Text Filed の Input Adornments を参照*/}
          <Controller
            name='position'
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                error={!!errors.position}
                helperText={errors.position?.message}
                label="ポジション名"
                id="outlined-start-adornment"
                sx={{ m: 1, width: '25ch'}}
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
            )}
          />
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
            onClick={handleSubmit(onsubmit)}
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
