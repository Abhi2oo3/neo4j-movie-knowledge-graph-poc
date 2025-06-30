import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import KPISection from '../components/KPISection';
import GenrePie from '../components/GenrePie';
import KeywordsBar from '../components/KeywordsBar';
import PopRevScatter from '../components/PopRevScatter';
import BudgetLine from '../components/BudgetLine';
import VoteHistogram from '../components/VoteHistogram';
import TopMoviesTable from '../components/TopMoviesTable';
import GraphExplorer from '../components/GraphExplorer';
import SimpleGraphExplorer from '../components/SimpleGraphExplorer';
import ModernKPI from '../components/ModernKPI';
import Recommendations from '../components/Recommendations';
import { Box, Tabs, Tab, Toolbar, Grid, Paper, CircularProgress } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

function TopKeywordsChart() {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/keywords')
      .then(res => res.json())
      .then(data => {
        setKeywords(Array.isArray(data) ? data.slice(0, 10) : []);
        setLoading(false);
      });
  }, []);

  const options = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
    dataLabels: { enabled: false },
    xaxis: { categories: keywords.map(k => k.keyword) },
    colors: ['#00AEEF'],
    grid: { borderColor: '#eee' },
  };

  return loading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
      <CircularProgress />
    </Box>
  ) : (
    <ReactApexChart
      options={options}
      series={[{ data: keywords.map(k => k.count) }]}
      type="bar"
      height={300}
    />
  );
}

export default function Home() {
  const [tab, setTab] = useState(0);
  const [overview, setOverview] = useState(null);
  const [genreData, setGenreData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/overview').then(res => res.json()).then(setOverview);
    fetch('/api/genres')
      .then(res => res.json())
      .then(data => {
        // Ensure data is an array, if not, set empty array
        setGenreData(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching genres:', error);
        setGenreData([]);
      });
    setLoading(false);
  }, []);

  const genreOptions = {
    chart: { type: 'donut' },
    labels: Array.isArray(genreData) ? genreData.map(g => g.genre) : [],
    legend: { position: 'bottom' },
    colors: ['#003366', '#00AEEF', '#FFBB28', '#FF8042', '#A28CFE', '#FF6699'],
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        <Toolbar />
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Dashboard" />
          <Tab label="Graph Explorer" />
        </Tabs>
        {tab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <ModernKPI title="Movies" value={overview?.movies ?? '-'} icon={<MovieIcon />} color="#003366" trend="+2%" trendDir="up" />
              </Grid>
              <Grid item xs={12} md={3}>
                <ModernKPI title="Actors" value={overview?.actors ?? '-'} icon={<PeopleIcon />} color="#00AEEF" trend="+1%" trendDir="up" />
              </Grid>
              <Grid item xs={12} md={3}>
                <ModernKPI title="Genres" value={overview?.genres ?? '-'} icon={<CategoryIcon />} color="#FFBB28" trend="0%" trendDir="up" />
              </Grid>
              <Grid item xs={12} md={3}>
                <ModernKPI title="Directors" value={overview?.directors ?? '-'} icon={<PersonIcon />} color="#FF8042" trend="-1%" trendDir="down" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
                  <Box sx={{ mb: 2, fontWeight: 600 }}>Movies by Genre</Box>
                  {genreData.length > 0 && (
                    <ReactApexChart
                      options={genreOptions}
                      series={Array.isArray(genreData) ? genreData.map(g => g.count) : []}
                      type="donut"
                      height={300}
                    />
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
                  <Box sx={{ mb: 2, fontWeight: 600 }}>Top Keywords</Box>
                  <TopKeywordsChart />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
                  <Recommendations />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        {tab === 1 && <SimpleGraphExplorer />}
      </Box>
    </Box>
  );
}