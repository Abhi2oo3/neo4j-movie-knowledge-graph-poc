import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Watchlist from '../components/Watchlist';
import { Box, Toolbar, Typography, Paper } from '@mui/material';

export default function WatchlistPage() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        <Toolbar />
        
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            My Watchlist
          </Typography>
          
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <Watchlist />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
} 