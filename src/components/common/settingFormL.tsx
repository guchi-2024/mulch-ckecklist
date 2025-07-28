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
import { Box, InputAdornment, List, ListItem, ListItemText, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addItemSchema, addItemSchemaTs } from '../../validations/schema';

interface SettingFormLProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ship: string;
  area: string;
  position: string;
  onSaveAddItem: (addItem: addItemSchemaTs) => Promise<void>;
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
    width: '75%',
    maxWidth: 'none',
    height: '95vh'

  },
}));

export default function SettingFormL({
  open,
  setOpen,
  ship,
  area,
  position,
  onSaveAddItem,
}: SettingFormLProps) {

  const handleClose = () => {
    setOpen(false);
  };

  const { 
    control, 
    handleSubmit, 
    formState:{errors},
    reset 
  } = useForm<addItemSchemaTs>({
    defaultValues: {
      item: "",
      number: 1,
      startDate: "2025/01/01",
      endDate: "2100/12/31"
    },
    resolver: zodResolver(addItemSchema)
  });



  const onsubmit: SubmitHandler<addItemSchemaTs> = (data) => {
    console.log("data:", data);
    onSaveAddItem(data)
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
          {ship} {area} {position}
        </DialogTitle>
        
        <DialogContent dividers>

        <Box
          component="form"
          onSubmit={handleSubmit(onsubmit)}
          sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          mt: 0, 
          }}
        >
          <List>
            <ListItem sx={{
              pl: 0, 
              display: "flex", 
              flexDirection: "column",
              alignItems: "flex-start"
    
            }}>
              <ListItemText 
                primary={
                  <Typography sx={{ fontSize: "25px", ml:0 }}>
                  ship:　{ship}
                  </Typography>
                  }
              />
              <ListItemText 
                primary={
                  <Typography sx={{ fontSize: "25px", ml:0 }}>
                  area:　{area}
                  </Typography>
                  }
              />
              <ListItemText 
                primary={
                  <Typography sx={{ fontSize: "25px", ml:0 }}>
                  position:　{position}
                  </Typography>
                  }
              />
            </ListItem>      
          </List>

          {/* アイテム名を入力 */}
          <Typography sx={{color: '#1976d2', fontSize: "15px"}}>
            追加するアイテム名を入力してください
          </Typography>
          {/* MUI Text Filed の Input Adornments を参照*/}
          <Box display={"flex"} mb={2}>
          <Typography sx={{ fontSize: "25px"}}>item:　</Typography>  
          <Controller
            name='item'
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                error={!!errors.item}
                helperText={errors.item?.message}
                label="アイテム名"
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

          {/* 個数を入力 */}
          <Typography sx={{color: '#1976d2', fontSize: "15px"}}>
            追加するアイテムの個数を入力してください
          </Typography>
          <Box display={"flex"}>
          <Typography sx={{ fontSize: "25px"}}>number:　</Typography>
          <Controller
            name='number'
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                error={!!errors.item}
                helperText={errors.item?.message}
                label="個数"
                id="outlined-start-adornment"
                sx={{ m: 1, width: '10ch'}}
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
          
          {/* 搭載期限を入力 */}
          <Typography sx={{color: '#1976d2', fontSize: "15px"}}>
            搭載期間を入力してください
          </Typography>
          <Box display={"flex"}>
            <Typography sx={{ fontSize: "25px"}}>period:　</Typography>
            {/* 搭載開始 */}
            <Controller
              name='startDate'
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  error={!!errors.item}
                  helperText={errors.item?.message}
                  label="搭載開始"
                  id="outlined-start-adornment"
                  sx={{ m: 1, width: '13ch'}}
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >  
              <Typography sx={{ fontSize: "25px"}}> から </Typography>
            </Box>
            {/* 搭載終了 */}
            <Controller
              name='endDate'
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  error={!!errors.item}
                  helperText={errors.item?.message}
                  label="搭載終了"
                  id="outlined-start-adornment"
                  sx={{ m: 1, width: '13ch'}}
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >  
              <Typography sx={{ fontSize: "25px"}}> まで </Typography>
            </Box>
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
