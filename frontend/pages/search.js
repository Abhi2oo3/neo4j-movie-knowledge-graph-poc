import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { 
  Box, 
  Toolbar, 
  Typography, 
  CircularProgress, 
  Card, 
  CardContent, 
  CardActions,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Movie as MovieIcon, 
  Person as PersonIcon,
  Category as CategoryIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&filter=${filter}`);
      const data = await response.json();
      
      if (response.ok) {
        setResults(Array.isArray(data) ? data : []);
      } else {
        setError(data.error || 'Search failed');
        setResults([]);
      }
    } catch (err) {
      setError('Network error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      handleSearch(q);
    }
  }, [q]);

  const getIconForType = (label) => {
    switch (label) {
      case 'Movie': return <MovieIcon />;
      case 'Person': return <PersonIcon />;
      case 'Genre': return <CategoryIcon />;
      default: return <ViewIcon />;
    }
  };

  const getColorForType = (label) => {
    switch (label) {
      case 'Movie': return '#003366';
      case 'Person': return '#00AEEF';
      case 'Genre': return '#FFBB28';
      default: return '#666';
    }
  };

  const formatResult = (item) => {
    if (item.label === 'Movie') {
      return {
        title: item.title,
        subtitle: item.release_date ? `Released: ${item.release_date}` : 'Release date unknown',
        description: item.overview || 'No description available',
        rating: item.vote_average,
        votes: item.vote_count
      };
    } else if (item.label === 'Person') {
      return {
        title: item.name,
        subtitle: item.birthday ? `Born: ${item.birthday}` : 'Birthday unknown',
        description: item.biography || 'No biography available',
        rating: null,
        votes: null
      };
    } else {
      return {
        title: item.name || item.title,
        subtitle: item.label,
        description: 'Click to view details',
        rating: null,
        votes: null
      };
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        <Toolbar />
        
        <Box sx={{ p: 3 }}>
          {/* Search Header */}
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
            Search Database
          </Typography>

          {/* Search Controls */}
          <Card sx={{ mb: 3, p: 2, boxShadow: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for movies, actors, directors, genres..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {loading && <CircularProgress size={20} />}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Type</InputLabel>
                  <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    label="Filter by Type"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="Movie">Movies</MenuItem>
                    <MenuItem value="Person">People</MenuItem>
                    <MenuItem value="Genre">Genres</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleSearch()}
                  disabled={loading || !searchQuery.trim()}
                  startIcon={<SearchIcon />}
                  sx={{ height: 56 }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Results Section */}
          {searchQuery && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ mr: 1 }}>
                  Search Results
                </Typography>
                <Chip 
                  label={`${results.length} results found`} 
                  color="primary" 
                  size="small" 
                />
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : results.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No results found
                  </Typography>
                  <Typography color="text.secondary">
                    Try adjusting your search terms or filters
                  </Typography>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {results.map((item, index) => {
                    const formatted = formatResult(item);
                    return (
                      <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4
                          }
                        }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Avatar sx={{ 
                                bgcolor: getColorForType(item.label),
                                mr: 2 
                              }}>
                                {getIconForType(item.label)}
                              </Avatar>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="div" noWrap>
                                  {formatted.title}
                                </Typography>
                                <Chip 
                                  label={item.label} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {formatted.subtitle}
                            </Typography>
                            
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              {formatted.description.length > 150 
                                ? `${formatted.description.substring(0, 150)}...` 
                                : formatted.description
                              }
                            </Typography>

                            {formatted.rating && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <StarIcon sx={{ color: '#FFD700', fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2">
                                  {formatted.rating.toFixed(1)} ({formatted.votes} votes)
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                          
                          <Divider />
                          <CardActions>
                            <Button size="small" color="primary">
                              View Details
                            </Button>
                            <Button size="small">
                              Add to Favorites
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          )}

          {/* Search Tips */}
          {!searchQuery && (
            <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Search Tips
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <MovieIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2">
                      Search for movies by title, director, or cast
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2">
                      Find actors, directors, and other people
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CategoryIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2">
                      Discover movies by genre or keywords
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
}
