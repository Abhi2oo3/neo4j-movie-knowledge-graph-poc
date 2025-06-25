import { useEffect, useState } from 'react';
import { Box, Typography, TextField, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function KeywordsTab() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/keywords')
      .then(res => res.json())
      .then(d => {
        console.log('Keywords API response:', d);
        if (!Array.isArray(d)) {
          setData([]);
          setLoading(false);
          return;
        }
        setData(d);
        setLoading(false);
      });
  }, []);

  const filtered = Array.isArray(data)
    ? (search ? data.filter(k => k.keyword.toLowerCase().includes(search.toLowerCase())) : data)
    : [];

  return (
    <Box>
      <Typography variant="h6" mb={2}>Top Keywords</Typography>
      <TextField
        label="Search Keyword"
        variant="outlined"
        size="small"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      {loading ? <CircularProgress /> : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filtered.slice(0, 20)} layout="vertical" margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis dataKey="keyword" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="count" fill="#00AEEF" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
} 