import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Slider } from '@mui/material';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PopularityRevenueTab() {
  const [data, setData] = useState([]);
  const [popRange, setPopRange] = useState([0, 100]);
  const [revRange, setRevRange] = useState([0, 1000000000]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/popularity-revenue')
      .then(res => res.json())
      .then(d => {
        console.log('Popularity/Revenue API response:', d);
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
  const popMin = Math.min(...safeData.map(d => d.popularity), 0);
  const popMax = Math.max(...safeData.map(d => d.popularity), 100);
  const revMin = Math.min(...safeData.map(d => d.revenue), 0);
  const revMax = Math.max(...safeData.map(d => d.revenue), 1000000000);

  const filtered = safeData.filter(d =>
    d.popularity >= popRange[0] && d.popularity <= popRange[1] &&
    d.revenue >= revRange[0] && d.revenue <= revRange[1]
  );

  return (
    <Box>
      <Typography variant="h6" mb={2}>Popularity vs Revenue</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography>Popularity Range</Typography>
        <Slider
          value={popRange}
          min={popMin}
          max={popMax}
          onChange={(_, v) => setPopRange(v)}
          valueLabelDisplay="auto"
        />
        <Typography>Revenue Range</Typography>
        <Slider
          value={revRange}
          min={revMin}
          max={revMax}
          onChange={(_, v) => setRevRange(v)}
          valueLabelDisplay="auto"
        />
      </Box>
      {loading ? <CircularProgress /> : (
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <XAxis dataKey="popularity" name="Popularity" />
            <YAxis dataKey="revenue" name="Revenue" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={filtered} fill="#003366" />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
} 