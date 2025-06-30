import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#003366', '#00AEEF', '#FFBB28', '#FF8042', '#A28CFE', '#FF6699'];

export default function GenrePie() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/genres').then(res => res.json()).then(setData);
  }, []);

  if (!Array.isArray(data)) return <CircularProgress sx={{ m: 2 }} />;

  return (
    <Box sx={{ width: 350 }}>
      <Typography variant="h6" mb={1}>Movies by Genre</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="genre" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
