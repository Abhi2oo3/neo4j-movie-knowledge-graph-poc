import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function VoteBudgetTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vote-budget')
      .then(res => res.json())
      .then(d => {
        console.log('Vote/Budget API response:', d);
        if (!Array.isArray(d)) {
          setData([]);
          setLoading(false);
          return;
        }
        setData(d);
        setLoading(false);
      });
  }, []);

  const safeData = Array.isArray(data) ? data : [];

  return (
    <Box>
      <Typography variant="h6" mb={2}>Vote Count Distribution</Typography>
      {loading ? <CircularProgress /> : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={safeData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <XAxis dataKey="vote_bin" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#003366" />
          </BarChart>
        </ResponsiveContainer>
      )}
      <Typography variant="h6" mt={4} mb={2}>Budget Over Movies</Typography>
      {loading ? <CircularProgress /> : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={safeData.slice(0, 50)} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <XAxis dataKey="title" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="budget" stroke="#00AEEF" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
} 