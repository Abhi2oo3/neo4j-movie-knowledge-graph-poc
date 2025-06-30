import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Box, Toolbar, Typography, Paper, Chip } from '@mui/material';
import { useEffect, useState } from 'react';

export default function Keywords() {
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    fetch('/api/keywords').then(res => res.json()).then(setKeywords);
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" mb={2}>Top Keywords</Typography>
          <Paper sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {keywords.slice(0, 40).map((k, i) => (
              <Chip key={i} label={`${k.keyword} (${k.count})`} color="primary" variant="outlined" />
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
