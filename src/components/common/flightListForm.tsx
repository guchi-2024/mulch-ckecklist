import { Box, Button, Divider, MenuItem, TextField, Typography } from '@mui/material'
import { grey, blueGrey, yellow} from '@mui/material/colors';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Controller, useForm } from 'react-hook-form';
import { flightListScema, flightListScemaTs } from '../../validations/schema';
import { CompanyShips, Flight, ShipNumbers } from '../../types';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

interface flightListFormProps {
  flight: Flight;
  company: string; 
  companyShips: CompanyShips; 
  shipNumbers: ShipNumbers; 
  onCancel: () => void; 
  onSave: (data: Flight) => void;
}

const FlightListForm = ({ 
  flight,
  company, 
  companyShips, 
  shipNumbers, 
  onCancel,
  onSave,
}: flightListFormProps) => {

  

  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<flightListScemaTs>({
    defaultValues: {
      company: company,
      ARR: flight.ARR,
      DEP: flight.DEP,
      ship: flight.ship,
      shipNo: flight.shipNo
    },
    resolver: zodResolver(flightListScema),
  })

   // 'ship'と'shipNo'フィールドの変更を監視
   const selectedShip = watch('ship');

    // shipタイプが変更されたら、shipNoの値をリセット
   useEffect(() => {
     setValue('shipNo', '');
   }, [selectedShip, setValue]);
    

   const onSubmit = (data: flightListScemaTs) => {
    // 既存のフライトリストに新しいARRが含まれていないかチェック
    onSave(data);
    console.log("送信されたデータ:", data);
  }

  return(
  <Box
    component="form"
    onSubmit={handleSubmit(onSubmit)}
    sx={{
      color: grey[900],
      bgcolor: blueGrey[100],
      minHeight: 102, // 高さを動的に変更可能にする
      width: 640,
      ml: 5, mb: 1,
      display: 'flex',
      alignItems: 'center', // 垂直方向の中央揃え
      borderRadius: "4px",
      border: '2px solid #546e7a',
      p: 1, // 全体的なパディング
    }}
    >
      {/* 中央のメインコンテンツ部分 */}
      <Box
        sx={{
          flexGrow: 1, // 残りのスペースを全て占める
          minHeight: 86, // 最小高さを設定
          border: '1px solid #78909c',
          borderRadius: "4px",
          mx: 1, // 左右のマージン
          p: 1, // 内部のパディング
          display: 'flex',
          flexDirection: 'column',
          bgcolor: yellow[100],
  
        }}
      >
        {/* 上段のデータ部分 */}
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
            <Box 
            sx={{
              pr: 1, 
              width: 240,
              height: 80,
              display:'flex',
              alignItems:'center'
             }}
              >
              <Controller
                name='ARR'
                control={control}
                defaultValue={flight.ARR}
                render={({field}) => (
                 <TextField
                   {...field}
                   label="ARR"
                   variant="outlined"
                   error={!!errors.ARR}
                   helperText={errors.ARR?.message}
                   sx={{ width: '15ch'}}
                   slotProps={{
                     input: {
                       sx: {
                         fontSize: 22,
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
              <Controller
                 name='DEP'
                 control={control}
                 defaultValue={flight.DEP}
                 render={({field}) => (
                  <TextField
                    {...field}
                    label="DEP"
                    variant="outlined"
                    sx={{ ml: 1, width: '15ch'}}
                    slotProps={{
                      input: {
                        sx: {
                          fontSize: 22,
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
          {/* </Box> */}
  
          <Divider orientation="vertical" flexItem sx={{ borderRight: '2px solid #cfd8dc' }} />
  
          <Box 
            sx={{ 
              pl: 1,
              pr: 1,
              width: 165, 
              height: 80,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* <Typography sx={{color: grey[500]}}>Ship Type</Typography>        */}
            <Controller
              name='ship'
              control={control}
              defaultValue={flight.ship}
              render={({field}) => (
               <TextField
                 {...field}
                 label="ShipType"
                 variant="outlined"
                 select
                 sx={{ width: '20ch'}}
                 slotProps={{
                   input: {
                     sx: {
                       fontSize: 22,
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
               {companyShips[company]?.map((shipType) => (
                <MenuItem key={shipType} value={shipType}>{shipType}</MenuItem>
              ))}
              </TextField>  

              )}
            />
          </Box>
  
          <Divider orientation="vertical" flexItem sx={{ borderRight: '2px solid #cfd8dc' }} />
  
          <Box 
            sx={{ 
              pl: 1,
              pr: 1,
              width: 120, 
              height: 80,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* <Typography sx={{color: grey[500]}}>Ship No</Typography> */}
            <Controller
               name='shipNo'
               control={control}
               render={({field}) => {
                return (
                    <TextField
                      {...field}
                      label="ShipNo"
                      variant="outlined"
                      select
                      disabled={!selectedShip} // shiptypeが選択されるまで無効化
                      sx={{ width: '12ch'}}
                      slotProps={{
                        input: {
                          sx: {
                            fontSize: 22,
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
                  {shipNumbers[selectedShip as keyof ShipNumbers]?.map((shipNo) => (
                      <MenuItem key={shipNo} value={shipNo}>{shipNo}</MenuItem>
                  ))}
                </TextField>
                  )
              
               }}
            />
          </Box>
        </Box>
        
        <Divider sx={{ borderBottom: '2px solid #cfd8dc' }} />
        
        {/* 下段のメモ部分 */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            伝達事項： なし<br/>
          </Typography>
        </Box>

        

      </Box>
            {/* 右側のボタン部分 */}
            <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          p: 2,
        }}
      >
        {/* フォームを保存するボタン */}
        <Button
          type="submit"
          // onClick={handleSubmit(onSubmit)}
          sx={{
            minWidth: 0,
            p: 0,
            color: '#00c853',
            '&:hover': {
              bgcolor: 'transparent',
            }
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 35 }}/>
        </Button>
        {/* フォームを閉じるボタン */}
        <Button
          onClick={onCancel}
          sx={{
            minWidth: 0,
            p: 0,
            mt: 2,
            color: '#ff5722',
            '&:hover': {
              bgcolor: 'transparent',
            }
          }}
        >
          <CancelIcon sx={{ fontSize: 35 }}/>
        </Button>
      </Box>      
  </Box>




)}
export default FlightListForm;