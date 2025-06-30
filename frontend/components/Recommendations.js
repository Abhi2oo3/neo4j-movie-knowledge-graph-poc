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
  Alert
} from '@mui/material';
import {
  Movie as MovieIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recommendations');
      const data = await response.json();
      if (response.ok) {
        setRecommendations(Array.isArray(data) ? data.slice(0, 6) : []);
      } else {
        setError(data.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getMoviePoster = (movie) => {
    return movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/api/placeholder/300/450';
  };

  const getRecommendationReason = (movie, index) => {
    const reasons = [
      'Based on your favorite genres',
      'Similar to movies you liked',
      'Highly rated by critics',
      'Trending this week',
      'From your favorite directors',
      'Popular among users like you'
    ];
    return reasons[index % reasons.length];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recommended for You
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        {recommendations.map((movie, index) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
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
              <CardMedia
                component="img"
                height="200"
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
                
                <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem' }}>
                  {getRecommendationReason(movie, index)}
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
                <Button size="small" color="primary">
                  Watch Now
                </Button>
                <Box>
                  <Tooltip title="Add to favorites">
                    <IconButton size="small">
                      <FavoriteIcon />
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
      
      {recommendations.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <MovieIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No recommendations yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start rating movies to get personalized recommendations
          </Typography>
        </Box>
      )}
    </Box>
  );
} 