import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PopRevScatter() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/popularity-revenue').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <CircularProgress sx={{ m: 2 }} />;

  return (
    <Box sx={{ width: 350 }}>
      <Typography variant="h6" mb={1}>Popularity vs Revenue</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart>
          <XAxis dataKey="popularity" name="Popularity" />
          <YAxis dataKey="revenue" name="Revenue" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={data} fill="#003366" />
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  );
}
