import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function BudgetLine() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/vote-budget').then(res => res.json()).then(setData);
  }, []);

  if (!Array.isArray(data)) return <CircularProgress sx={{ m: 2 }} />;

  return (
    <Box sx={{ width: 350 }}>
      <Typography variant="h6" mb={1}>Budget Over Movies</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data.slice(0, 50)}>
          <XAxis dataKey="title" hide />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="budget" stroke="#00AEEF" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
