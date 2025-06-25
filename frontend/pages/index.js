import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import {
  Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, IconButton, Divider, Tabs, Tab, useTheme, useMediaQuery, ThemeProvider, createTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import OverviewTab from '../components/OverviewTab';
import GenresTab from '../components/GenresTab';
import KeywordsTab from '../components/KeywordsTab';
import PopularityRevenueTab from '../components/PopularityRevenueTab';
import VoteBudgetTab from '../components/VoteBudgetTab';
import GraphTab from '../components/GraphTab';

const drawerWidth = 320;

const corporateTheme = createTheme({
  palette: {
    primary: { main: '#003366' }, // Corporate blue
    secondary: { main: '#00AEEF' }, // Accent blue
    background: { default: '#f4f6f8', paper: '#fff' },
    text: { primary: '#222', secondary: '#555' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontWeightBold: 700,
  },
});

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleTabChange = (e, v) => setTab(v);

  const drawer = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Movie Knowledge Graph
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {/* Place filters/search here if needed globally */}
    </Box>
  );

  return (
    <ThemeProvider theme={corporateTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CssBaseline />
        <AppBar position="fixed" color="primary" sx={{ zIndex: 1201 }}>
          <Toolbar>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div">
              Movie Knowledge Graph Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          {/* Drawer for mobile, permanent for desktop */}
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>
          ) : (
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              open
            >
              {drawer}
            </Drawer>
          )}
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, md: 3 }, width: { md: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="primary"
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons={isMobile ? 'auto' : false}
            sx={{ mb: 2 }}
          >
            <Tab label="Overview" />
            <Tab label="Genres" />
            <Tab label="Keywords" />
            <Tab label="Popularity/Revenue" />
            <Tab label="Vote/Budget" />
            <Tab label="Graph" />
          </Tabs>
          {tab === 0 && <OverviewTab />}
          {tab === 1 && <GenresTab />}
          {tab === 2 && <KeywordsTab />}
          {tab === 3 && <PopularityRevenueTab />}
          {tab === 4 && <VoteBudgetTab />}
          {tab === 5 && <GraphTab />}
        </Box>
      </Box>
    </ThemeProvider>
  );
} 