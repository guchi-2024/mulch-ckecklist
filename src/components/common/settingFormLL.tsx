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
import { Box, InputAdornment, ListItem, ListItemText, MenuItem, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editPositionSchema, editPositionSchemaTs, editItemSchema, editItemSchemaTs } from '../../validations/schema';
import { ListItems } from '../../types';

interface SettingFormLLProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ship: string;
  area: string;
  position: string;
  itemName: string;
  selectArea: string[];
  selectPositionByArea: {[key: string]: string[]}
  setOldPosition: React.Dispatch<React.SetStateAction<string>>
  setOldArea: React.Dispatch<React.SetStateAction<string>>;
  oldArea: string;
  itemNumber: number;
  itemStartDate: string;
  itemEndDate: string;
  OnUpdateItem: (updatedData: editItemSchemaTs) => Promise<void>;
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
    height: '100vh'

  },
}));

export default function SettingFormLL({
  open,
  setOpen,
  ship,
  area,
  position,
  selectArea,
  selectPositionByArea,
  setOldPosition,
  setOldArea,
  oldArea,
  itemName,
  itemNumber,
  itemStartDate,
  itemEndDate,
  OnUpdateItem,
}: SettingFormLLProps) {

  

  const handleClose = () => {
    setOpen(false);
  };

  const { 
    control, 
    handleSubmit, 
    formState:{errors},
    reset,
    watch,
    setValue,
    // clearErrors, 
  } = useForm<editItemSchemaTs>({
    defaultValues: {
       area: area, 
       position: position,
       item: itemName,
       number: itemNumber,
       startDate: itemStartDate,
       endDate: itemEndDate
    },
    resolver: zodResolver(editItemSchema),
    mode: 'onChange'
  });

  // areaフィールドの値を監視
  const watchedArea = watch('area');

  React.useEffect(() => {
    // 初回レンダリング時（またはareaが初期値のままの場合）はスキップ    
      const currentPositionOptions = selectPositionByArea[watchedArea] || [];
      const uniquePositions = [...new Set(currentPositionOptions)];
      console.log("currentPositionOptions:",currentPositionOptions);
      console.log("uniquePositions:", uniquePositions)
      console.log("watchedArea: ", watchedArea)


      // 現在のpositionの値が新しいエリアの選択肢に含まれているかチェック
      const currentPositionValue = watch('position');
      if (!uniquePositions.includes(currentPositionValue)) {
        // 含まれていない場合、positionをリセット
        setValue('position', '', { shouldValidate: true }); // 空文字にリセットし、バリデーションを再実行
        // clearErrors('position'); // 古いエラーメッセージをクリア
      }
  },[watchedArea, selectPositionByArea, setValue, watch]);


  const onsubmit: SubmitHandler<editItemSchemaTs> = (data) => {
    console.log("data:", data);
    OnUpdateItem(data);
    reset({
      area: data.area,
      position: data.position,
      item: data.item,
      number: data.number,
      startDate: data.startDate,
      endDate: data.endDate
    });
    handleClose();
  };
  // console.log("resolver error:", errors);

  // エラーを確認するためのログ（開発用）
  console.log("Form errors:", errors);
  // console.log("Current form values:", watch());

  // watchedAreaに対応するユニークなポジションリストを取得
  const uniquePositionsForSelectedArea: string[] = React.useMemo(() => {
    const positions = selectPositionByArea[watchedArea];
    return positions ? [...new Set(positions)] : [];
  }, [watchedArea, selectPositionByArea]);

  

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
          {ship} {area} {position} {itemName}
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
          <ListItemText 
            primary={
              <Typography sx={{ fontSize: "25px", ml:0, mb:2 }}>
              ship:　{ship}
              </Typography>
              }
          />
          <Typography sx={{color: '#1976d2', fontSize: "15px"}}>
            エリアを変更する場合、選択してください
          </Typography>
          <Box display={"flex"} >
            <Typography sx={{ fontSize: "25px"}}>area:　</Typography>  
            {/* MUI Text Filed の Input Adornments を参照*/}
            <Controller
              name='area'
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  error={!!errors.area}
                  helperText={errors.area?.message}
                  label="エリア名"
                  id="outlined-start-adornment"
                  select
                  sx={{ m: 1, width: '12ch'}}
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
                >
                  {selectArea.map((areaOption, index) => (
                    <MenuItem value={areaOption} key={index}>
                      {areaOption}
                    </MenuItem>
                  ))}
                </TextField>   
              )}
            />
          </Box>

          <Typography sx={{color: '#1976d2', fontSize: "15px"}}>
            ポジションを変更する場合、選択してください
          </Typography>
          <Box display={"flex"} >
            <Typography sx={{ fontSize: "25px"}}>position:　</Typography>
            {/* MUI Text Filed の Input Adornments を参照*/}
            <Controller
              name='position'
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  key={watchedArea}
                  error={!!errors.position}
                  helperText={errors.position?.message}
                  label="ポジション名"
                  id="outlined-start-adornment-position"
                  select
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
                >
                  {/* watchで監視しているwatchedAreaに基づいて選択肢を生成 */}
                  {uniquePositionsForSelectedArea.length > 0 ? (
                      uniquePositionsForSelectedArea.map((positionOption, index) => ( 
                        <MenuItem value={positionOption} key={index}>
                          {positionOption}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        選択肢がありません
                      </MenuItem>
                    )}
                 
                </TextField>     
              )}
            />
          </Box>
        </Box>

        {/* アイテム名を入力 */}
        <Typography sx={{color: '#1976d2', fontSize: "15px"}}>
            アイテム名を変更する場合、入力してください
        </Typography>
        {/* MUI Text Filed の Input Adornments を参照*/}
        <Box display={"flex"} >
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
                      },
                    }
                  }}
              />      
            )}
          />
        </Box>

        {/* 個数を入力 */}
        <Typography sx={{color: '#1976d2', fontSize: "15px"}}>
            アイテムの個数を変更する場合、入力してください
        </Typography>
        <Box display={"flex"}>
          <Typography sx={{ fontSize: "25px"}}>number:　</Typography>
          <Controller
            name='number'
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                error={!!errors.number}
                helperText={errors.number?.message}
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
                      },
                    }
                  }}
              />      
            )}
          />  
        </Box>

        {/* 搭載期限を入力 */}
          <Typography sx={{color: '#1976d2', fontSize: "15px"}}>
            搭載期間を変更する場合、入力してください
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
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
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
                        },
                        // startAdornment: 
                        //  <InputAdornment position="start">
                        //   <Typography component="span" sx={{ color: 'black' }}> 
                        //    {itemStartDate}
                        //   </Typography>
                        //  </InputAdornment>,
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
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
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
                        },
                        // startAdornment: 
                        //   <InputAdornment position="start">
                        //     <Typography component="span" sx={{ color: 'black' }}>
                        //       {itemEndDate}
                        //     </Typography>
                        //   </InputAdornment>,
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
