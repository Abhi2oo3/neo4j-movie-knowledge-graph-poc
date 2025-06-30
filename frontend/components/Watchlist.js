import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Button,
  Chip,
  Grid,
  Rating,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Movie as MovieIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  CheckCircle as WatchedIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    // Load from localStorage for now
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
    setLoading(false);
  };

  const saveWatchlist = (newWatchlist) => {
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    setWatchlist(newWatchlist);
  };

  const addToWatchlist = (movie) => {
    const newWatchlist = [...watchlist, { ...movie, addedDate: new Date().toISOString(), watched: false }];
    saveWatchlist(newWatchlist);
    setAddDialogOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeFromWatchlist = (movieId) => {
    const newWatchlist = watchlist.filter(movie => movie.id !== movieId);
    saveWatchlist(newWatchlist);
  };

  const markAsWatched = (movieId) => {
    const newWatchlist = watchlist.map(movie => 
      movie.id === movieId ? { ...movie, watched: !movie.watched } : movie
    );
    saveWatchlist(newWatchlist);
  };

  const searchMovies = async () => {
    if (!searchTerm.trim()) return;
    
    setSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&filter=Movie`);
      const data = await response.json();
      if (response.ok) {
        setSearchResults(Array.isArray(data) ? data.slice(0, 5) : []);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const getMoviePoster = (movie) => {
    return movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/api/placeholder/300/450';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          My Watchlist ({watchlist.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Movie
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {watchlist.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <MovieIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your watchlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start adding movies to keep track of what you want to watch
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add Your First Movie
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {watchlist.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                opacity: movie.watched ? 0.7 : 1,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={getMoviePoster(movie)}
                  alt={movie.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1 }}>
                      {movie.title}
                    </Typography>
                    {movie.watched && (
                      <WatchedIcon color="success" />
                    )}
                  </Box>
                  
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
                  
                  <Typography variant="body2" sx={{ mb: 1, fontSize: '0.75rem' }}>
                    Added: {formatDate(movie.addedDate)}
                  </Typography>
                  
                  {movie.genres && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {movie.genres.slice(0, 2).map((genre, idx) => (
                        <Chip 
                          key={idx} 
                          label={genre} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button 
                    size="small" 
                    color={movie.watched ? "success" : "primary"}
                    startIcon={movie.watched ? <WatchedIcon /> : <PlayIcon />}
                    onClick={() => markAsWatched(movie.id)}
                  >
                    {movie.watched ? 'Watched' : 'Watch Now'}
                  </Button>
                  <Box>
                    <Tooltip title="Remove from watchlist">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => removeFromWatchlist(movie.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton size="small">
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Movie Dialog */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Movie to Watchlist</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Search for a movie"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchMovies()}
            placeholder="Enter movie title..."
            sx={{ mb: 2, mt: 1 }}
          />
          
          <Button
            fullWidth
            variant="outlined"
            onClick={searchMovies}
            disabled={searching || !searchTerm.trim()}
            sx={{ mb: 2 }}
          >
            {searching ? <CircularProgress size={20} /> : 'Search'}
          </Button>
          
          {searchResults.length > 0 && (
            <List>
              {searchResults.map((movie) => (
                <ListItem key={movie.id} divider>
                  <ListItemIcon>
                    <img
                      src={getMoviePoster(movie)}
                      alt={movie.title}
                      style={{ width: 50, height: 75, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={movie.title}
                    secondary={`${movie.release_date?.split('-')[0] || 'Unknown Year'} • Rating: ${movie.vote_average?.toFixed(1) || 'N/A'}`}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => addToWatchlist(movie)}
                      disabled={watchlist.some(w => w.id === movie.id)}
                    >
                      {watchlist.some(w => w.id === movie.id) ? 'Added' : 'Add'}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 