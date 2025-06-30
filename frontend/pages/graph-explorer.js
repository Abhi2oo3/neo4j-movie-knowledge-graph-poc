import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BasicGraphExplorer from '../components/BasicGraphExplorer';
import { Box, Toolbar, Typography, Paper } from '@mui/material';

export default function GraphExplorerPage() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        <Toolbar />
        
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Graph Explorer
          </Typography>
          
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <BasicGraphExplorer />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
