import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function KeywordsBar() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/keywords').then(res => res.json()).then(setData);
  }, []);

  if (!Array.isArray(data)) return <CircularProgress sx={{ m: 2 }} />;

  return (
    <Box sx={{ width: 350 }}>
      <Typography variant="h6" mb={1}>Top Keywords</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data.slice(0, 10)} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="keyword" type="category" width={120} />
          <Tooltip />
          <Bar dataKey="count" fill="#00AEEF" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
