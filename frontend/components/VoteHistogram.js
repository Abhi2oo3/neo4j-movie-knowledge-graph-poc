import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function VoteHistogram() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/vote-budget').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <CircularProgress sx={{ m: 2 }} />;

  // Create histogram bins for vote_count
  const bins = Array(10).fill(0);
  const maxVote = Math.max(...data.map(d => d.vote_count), 1);
  data.forEach(d => {
    const bin = Math.floor((d.vote_count / maxVote) * 9);
    bins[bin]++;
  });
  const histogram = bins.map((count, i) => ({ vote_bin: `${i * 10}%`, count }));

  return (
    <Box sx={{ width: 350 }}>
      <Typography variant="h6" mb={1}>Vote Count Distribution</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={histogram}>
          <XAxis dataKey="vote_bin" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#003366" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
