import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Divider } from '@mui/material';

function createData(
  No: number,
  ARR: string,
  DEP: string,
  shipType: string,
) {
  return { No, ARR, DEP, shipType };
}

const rows = [
  createData(110, "331", "304", "A350"),
  createData(120, "333", "300", "A350"),
  createData(130, "335", "302", "A350"),
  createData(140, "", "", ""),
  createData(150, "", "", ""),
];

export default function DenseTable() {
  return (
    <>
    <Box
        sx={{
          width: 300,
          borderBottom: '3px solid #f5f5f5',
          m: 3,
          fontSize: 40,
          fontWeight: "fontWeightBold",
        }}
      >
       JAL
      </Box>
    <TableContainer component={Paper} sx={{ width: 600, margin: 'auto' }}>
      <Table sx={{ minWidth: 600, tableLayout: 'fixed' }} size="medium" aria-label="a dense table">
        <TableHead>
          <TableRow sx={{ borderBottom: '2px solid #455a64' }}>
            <TableCell sx={{width: '10%', fontSize: 25}}>No</TableCell>
            <TableCell align="left" sx={{width: '10%', fontSize: 25}}>ARR</TableCell>
            <TableCell align="left" sx={{width: '10%', fontSize: 25}}>DEP</TableCell>
            <TableCell align="left" sx={{width: '15%', fontSize: 25}}>ShipType</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.No}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, fontSize: 50 }}
            >
              <TableCell component="th" scope="row" sx={{fontSize: 25}}>
                {row.No}
              </TableCell>
              <TableCell align="left" sx={{fontSize: 25}}>{row.ARR}</TableCell>
              <TableCell align="left" sx={{fontSize: 25}}>{row.DEP}</TableCell>
              <TableCell align="left" sx={{fontSize: 25}}>{row.shipType}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>   
  );
}

