import { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

export default function TopMoviesTable() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/popularity-revenue').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <CircularProgress sx={{ m: 2 }} />;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" mb={1}>Top Movies by Popularity</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Popularity</TableCell>
              <TableCell>Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(0, 10).map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.popularity}</TableCell>
                <TableCell>{row.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
