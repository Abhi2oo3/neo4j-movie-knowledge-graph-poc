import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#003366', '#00AEEF', '#FFBB28'];

export default function OverviewTab() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/overview')
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}><CircularProgress /></Box>;

  const pieData = [
    { name: 'Movies', value: summary.movies },
    { name: 'Actors', value: summary.actors },
    { name: 'Genres', value: summary.genres },
  ];

  return (
    <Box>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Movies</Typography>
              <Typography variant="h4" color="primary">{summary.movies}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Actors</Typography>
              <Typography variant="h4" color="primary">{summary.actors}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Genres</Typography>
              <Typography variant="h4" color="primary">{summary.genres}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="h6" mb={1}>Distribution</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
} 