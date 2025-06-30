import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { 
  Box, 
  Toolbar, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  Pagination,
  Avatar,
  Rating,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person as PersonIcon,
  Movie as MovieIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedActor, setSelectedActor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState(0);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [actorsPerPage] = useState(12);

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/actors');
      const data = await response.json();
      console.log('Actors API response:', data); // Debug log
      if (response.ok) {
        setActors(Array.isArray(data) ? data : []);
      } else {
        setError(data.error || 'Failed to fetch actors');
      }
    } catch (err) {
      console.error('Fetch actors error:', err);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleActorClick = (actor) => {
    setSelectedActor(actor);
    setDialogOpen(true);
  };

  const filteredActors = actors.filter(actor => {
    const matchesSearch = actor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actor.biography?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || actor.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const sortedActors = [...filteredActors].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'name') {
      aValue = aValue?.toLowerCase() || '';
      bValue = bValue?.toLowerCase() || '';
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedActors = sortedActors.slice(
    (page - 1) * actorsPerPage,
    page * actorsPerPage
  );

  const getActorImage = (actor) => {
    return actor.profile_path 
      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
      : '/api/placeholder/300/450';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Unknown';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />
        <Toolbar />
        
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Actors & Directors
          </Typography>

          {/* Filters */}
          <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Actors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or biography..."
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    label="Type"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="Actor">Actors</MenuItem>
                    <MenuItem value="Director">Directors</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="movie_count">Movie Count</MenuItem>
                    <MenuItem value="type">Type</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Order</InputLabel>
                  <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    label="Order"
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Results Info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {filteredActors.length} people found
            </Typography>
            <Chip 
              label={`Page ${page} of ${Math.ceil(filteredActors.length / actorsPerPage)}`} 
              color="primary" 
            />
          </Box>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Debug Info */}
          {!loading && actors.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No actors found. This might be due to empty database or API issues.
            </Alert>
          )}

          {/* Actors Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedActors.map((actor) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`${actor.type}-${actor.name}`}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => handleActorClick(actor)}
                    >
                      <CardMedia
                        component="img"
                        height="400"
                        image={getActorImage(actor)}
                        alt={actor.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" noWrap gutterBottom>
                          {actor.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            label={actor.type} 
                            size="small" 
                            color={actor.type === 'Actor' ? 'primary' : 'secondary'}
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2">
                            {actor.movie_count || 0} movies
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {actor.birthday ? `${formatDate(actor.birthday)} (${calculateAge(actor.birthday)} years)` : 'Birth date unknown'}
                        </Typography>
                        
                        <Typography variant="body2" noWrap>
                          {actor.biography?.substring(0, 100) || 'No biography available'}...
                        </Typography>
                      </CardContent>
                      
                      <CardActions sx={{ justifyContent: 'space-between' }}>
                        <Button size="small" color="primary">
                          View Details
                        </Button>
                        <Box>
                          <IconButton size="small">
                            <FavoriteIcon />
                          </IconButton>
                          <IconButton size="small">
                            <ShareIcon />
                          </IconButton>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {filteredActors.length > actorsPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={Math.ceil(filteredActors.length / actorsPerPage)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Actor Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedActor && (
          <>
            <DialogTitle>
              <Typography variant="h5">{selectedActor.name}</Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                  <Tab label="Overview" />
                  <Tab label="Movies" />
                  <Tab label="Biography" />
                </Tabs>
              </Box>
              
              {tab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <img
                      src={getActorImage(selectedActor)}
                      alt={selectedActor.name}
                      style={{ width: '100%', borderRadius: 8 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            <strong>Birth Date:</strong> {formatDate(selectedActor.birthday)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            <strong>Age:</strong> {calculateAge(selectedActor.birthday)} years
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            <strong>Type:</strong> {selectedActor.type}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <MovieIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            <strong>Movies:</strong> {selectedActor.movie_count || 0}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    {selectedActor.biography && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>Biography</Typography>
                        <Typography variant="body2">
                          {selectedActor.biography.substring(0, 300)}...
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              )}
              
              {tab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Known Movies</Typography>
                  {selectedActor.movies && selectedActor.movies.length > 0 ? (
                    <List>
                      {selectedActor.movies.slice(0, 10).map((movie, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <MovieIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={movie.title}
                            secondary={`${movie.release_date?.split('-')[0] || 'Unknown Year'} • Rating: ${movie.vote_average?.toFixed(1) || 'N/A'}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary">No movie information available.</Typography>
                  )}
                </Box>
              )}
              
              {tab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Full Biography</Typography>
                  <Typography variant="body2" paragraph>
                    {selectedActor.biography || 'No biography available for this person.'}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button variant="contained" startIcon={<FavoriteIcon />}>
                Add to Favorites
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
