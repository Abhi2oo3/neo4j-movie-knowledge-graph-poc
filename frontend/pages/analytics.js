import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { 
  Box, 
  Toolbar, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Analytics() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [overview, genres, keywords, popularity] = await Promise.all([
        fetch('/api/overview').then(res => res.json()),
        fetch('/api/genres').then(res => res.json()),
        fetch('/api/keywords').then(res => res.json()),
        fetch('/api/popularity-revenue').then(res => res.json())
      ]);

      setAnalyticsData({
        overview: Array.isArray(overview) ? overview : {},
        genres: Array.isArray(genres) ? genres : [],
        keywords: Array.isArray(keywords) ? keywords : [],
        popularity: Array.isArray(popularity) ? popularity : []
      });
    } catch (err) {
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const genreChartOptions = {
    chart: { type: 'donut' },
    labels: analyticsData.genres?.map(g => g.genre) || [],
    legend: { position: 'bottom' },
    colors: ['#003366', '#00AEEF', '#FFBB28', '#FF8042', '#A28CFE', '#FF6699', '#00D4AA', '#FF6B6B'],
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    }
  };

  const keywordChartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
    dataLabels: { enabled: false },
    xaxis: { 
      categories: analyticsData.keywords?.slice(0, 15).map(k => k.keyword) || [],
      labels: { style: { fontSize: '12px' } }
    },
    colors: ['#00AEEF'],
    grid: { borderColor: '#eee' }
  };

  const popularityChartOptions = {
    chart: { type: 'scatter', toolbar: { show: false } },
    xaxis: { 
      title: { text: 'Popularity' },
      type: 'numeric'
    },
    yaxis: { 
      title: { text: 'Revenue ($)' },
      labels: { formatter: (value) => `$${(value / 1000000).toFixed(1)}M` }
    },
    colors: ['#003366'],
    tooltip: {
      y: {
        formatter: (value) => `$${(value / 1000000).toFixed(1)}M`
      }
    }
  };

  const timelineChartOptions = {
    chart: { type: 'line', toolbar: { show: false } },
    xaxis: { 
      type: 'datetime',
      title: { text: 'Release Year' }
    },
    yaxis: { 
      title: { text: 'Average Rating' },
      min: 0,
      max: 10
    },
    colors: ['#FFBB28'],
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 4 }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <Topbar />
          <Toolbar />
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        <Toolbar />
        
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Analytics & Statistics
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{analyticsData.overview?.movies || 0}</Typography>
                      <Typography variant="body2">Total Movies</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BarChartIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{analyticsData.overview?.actors || 0}</Typography>
                      <Typography variant="body2">Total Actors</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PieChartIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{analyticsData.overview?.genres || 0}</Typography>
                      <Typography variant="body2">Genres</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimelineIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{analyticsData.keywords?.length || 0}</Typography>
                      <Typography variant="body2">Keywords</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Tabs */}
          <Paper sx={{ boxShadow: 2 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Genre Distribution" />
              <Tab label="Top Keywords" />
              <Tab label="Popularity vs Revenue" />
              <Tab label="Rating Timeline" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {tab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Movie Distribution by Genre</Typography>
                  <ReactApexChart
                    options={genreChartOptions}
                    series={analyticsData.genres?.map(g => g.count) || []}
                    type="donut"
                    height={400}
                  />
                </Box>
              )}
              
              {tab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Top 15 Keywords</Typography>
                  <ReactApexChart
                    options={keywordChartOptions}
                    series={[{ data: analyticsData.keywords?.slice(0, 15).map(k => k.count) || [] }]}
                    type="bar"
                    height={400}
                  />
                </Box>
              )}
              
              {tab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Popularity vs Revenue Correlation</Typography>
                  <ReactApexChart
                    options={popularityChartOptions}
                    series={[{
                      name: 'Movies',
                      data: analyticsData.popularity?.map(m => [m.popularity, m.revenue]) || []
                    }]}
                    type="scatter"
                    height={400}
                  />
                </Box>
              )}
              
              {tab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Average Rating by Release Year</Typography>
                  <ReactApexChart
                    options={timelineChartOptions}
                    series={[{
                      name: 'Average Rating',
                      data: analyticsData.popularity?.map(m => [new Date(m.release_date).getTime(), m.vote_average]) || []
                    }]}
                    type="line"
                    height={400}
                  />
                </Box>
              )}
            </Box>
          </Paper>

          {/* Additional Statistics */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom>Data Quality Metrics</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Movies with Ratings:</Typography>
                  <Typography variant="h6" color="primary">
                    {analyticsData.popularity?.filter(m => m.vote_average > 0).length || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Movies with Revenue Data:</Typography>
                  <Typography variant="h6" color="primary">
                    {analyticsData.popularity?.filter(m => m.revenue > 0).length || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Average Rating:</Typography>
                  <Typography variant="h6" color="primary">
                    {(analyticsData.popularity?.reduce((sum, m) => sum + (m.vote_average || 0), 0) / 
                      (analyticsData.popularity?.filter(m => m.vote_average > 0).length || 1)).toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom>Top Performing Genres</Typography>
                {analyticsData.genres?.slice(0, 5).map((genre, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{genre.genre}:</Typography>
                    <Typography variant="h6" color="primary">
                      {genre.count} movies
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
} 