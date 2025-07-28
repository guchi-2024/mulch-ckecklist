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
import { Box, InputAdornment, MenuItem, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editPositionSchema, editPositionSchemaTs } from '../../validations/schema';

interface SettingFormMProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ship: string;
  area: string;
  position: string;
  selectArea: string[];
  selectPositionByArea: {[key: string]: string[]}
  setOldPosition: React.Dispatch<React.SetStateAction<string>>
  setOldArea: React.Dispatch<React.SetStateAction<string>>;
  oldArea: string;
  OnUpdatePosition: (editPositon: editPositionSchemaTs, targetShip: string, targetArea: string) => Promise<void>; 
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
    height: '50vh'

  },
}));

export default function SettingFormM({
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
  OnUpdatePosition,
}: SettingFormMProps) {

  

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
  } = useForm<editPositionSchemaTs>({
    defaultValues: {
       area: area, 
       position: position
    },
    resolver: zodResolver(editPositionSchema),
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


  const onsubmit: SubmitHandler<editPositionSchemaTs> = (data) => {
    console.log("data:", data);
    OnUpdatePosition(data, ship, oldArea);
    reset({
      area: data.area,
      position: data.position
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
          {ship} {area} {position}
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
            エリアの変更が必要な場合のみ、変更してください
          </Typography>

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

          <Typography sx={{color: '#1976d2', fontSize: "15px"}}>
            変更するポジション名を選択してください
          </Typography>

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
