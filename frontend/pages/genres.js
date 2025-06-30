import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Box, Toolbar, Typography, Paper } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Genres() {
  const [genreData, setGenreData] = useState([]);

  useEffect(() => {
    fetch('/api/genres').then(res => res.json()).then(setGenreData);
  }, []);

  const options = {
    chart: { type: 'bar' },
    xaxis: { categories: genreData.map(g => g.genre) },
    colors: ['#003366'],
    dataLabels: { enabled: false },
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" mb={2}>Genres</Typography>
          <Paper sx={{ p: 2 }}>
            {genreData.length > 0 && (
              <ReactApexChart
                options={options}
                series={[{ data: genreData.map(g => g.count) }]}
                type="bar"
                height={400}
              />
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
