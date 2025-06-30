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
  Slider,
  Paper,
  IconButton,
  Rating,
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
  Pagination
} from '@mui/material';
import {
  Movie as MovieIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState([1900, 2024]);
  const [ratingFilter, setRatingFilter] = useState([0, 10]);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [moviesPerPage] = useState(12);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/movies');
      const data = await response.json();
      if (response.ok) {
        setMovies(Array.isArray(data) ? data : []);
      } else {
        setError(data.error || 'Failed to fetch movies');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setDialogOpen(true);
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = (movie.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (movie.overview?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || (Array.isArray(movie.genres) && movie.genres.includes(genreFilter));
    const year = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null;
    const matchesYear = year === null || (year >= yearFilter[0] && year <= yearFilter[1]);
    const rating = typeof movie.vote_average === 'number' ? movie.vote_average : null;
    const matchesRating = rating === null || (rating >= ratingFilter[0] && rating <= ratingFilter[1]);
    return matchesSearch && matchesGenre && matchesYear && matchesRating;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'title') {
      aValue = aValue?.toLowerCase() || '';
      bValue = bValue?.toLowerCase() || '';
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedMovies = sortedMovies.slice(
    (page - 1) * moviesPerPage,
    page * moviesPerPage
  );

  const getMoviePoster = (movie) => {
    return movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/api/placeholder/300/450';
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Unknown';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
            Movie Database
          </Typography>

          {/* Filters */}
          <Paper sx={{ p: 3, mb: 3, boxShadow: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Search Movies"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description..."
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    label="Genre"
                  >
                    <MenuItem value="all">All Genres</MenuItem>
                    <MenuItem value="Action">Action</MenuItem>
                    <MenuItem value="Comedy">Comedy</MenuItem>
                    <MenuItem value="Drama">Drama</MenuItem>
                    <MenuItem value="Horror">Horror</MenuItem>
                    <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                    <MenuItem value="Thriller">Thriller</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="release_date">Release Date</MenuItem>
                    <MenuItem value="vote_average">Rating</MenuItem>
                    <MenuItem value="popularity">Popularity</MenuItem>
                    <MenuItem value="budget">Budget</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
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
              
              <Grid item xs={12} md={3}>
                <Typography variant="body2" gutterBottom>Year Range</Typography>
                <Slider
                  value={yearFilter}
                  onChange={(_, value) => setYearFilter(value)}
                  min={1900}
                  max={2024}
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>Rating Range</Typography>
              <Slider
                value={ratingFilter}
                onChange={(_, value) => setRatingFilter(value)}
                min={0}
                max={10}
                step={0.5}
                valueLabelDisplay="auto"
              />
            </Box>
          </Paper>

          {/* Results Info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {filteredMovies.length} movies found
            </Typography>
            <Chip 
              label={`Page ${page} of ${Math.ceil(filteredMovies.length / moviesPerPage)}`} 
              color="primary" 
            />
          </Box>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Movies Grid */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedMovies.map((movie) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
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
                    onClick={() => handleMovieClick(movie)}
                    >
                      <CardMedia
                        component="img"
                        height="400"
                        image={getMoviePoster(movie)}
                        alt={movie.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" noWrap gutterBottom>
                          {movie.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating 
                            value={movie.vote_average / 2} 
                            precision={0.5} 
                            size="small" 
                            readOnly 
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({movie.vote_count})
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {movie.release_date?.split('-')[0] || 'Unknown Year'}
                        </Typography>
                        
                        <Typography variant="body2" noWrap>
                          {movie.overview?.substring(0, 100)}...
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
              {filteredMovies.length > moviesPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={Math.ceil(filteredMovies.length / moviesPerPage)}
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

      {/* Movie Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedMovie && (
          <>
            <DialogTitle>
              <Typography variant="h5">{selectedMovie.title}</Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <img
                    src={getMoviePoster(selectedMovie)}
                    alt={selectedMovie.title}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>Overview</Typography>
                  <Typography variant="body2" paragraph>
                    {selectedMovie.overview || 'No overview available.'}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          <strong>Release Date:</strong> {selectedMovie.release_date || 'Unknown'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <StarIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          <strong>Rating:</strong> {selectedMovie.vote_average?.toFixed(1) || 'N/A'} ({selectedMovie.vote_count || 0} votes)
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          <strong>Budget:</strong> {formatCurrency(selectedMovie.budget)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          <strong>Revenue:</strong> {formatCurrency(selectedMovie.revenue)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {selectedMovie.genres && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" gutterBottom>Genres</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedMovie.genres.map((genre, index) => (
                          <Chip key={index} label={genre} size="small" />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>
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
