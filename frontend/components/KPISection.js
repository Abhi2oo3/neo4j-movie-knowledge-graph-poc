import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';

export default function KPISection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/overview').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <CircularProgress sx={{ m: 2 }} />;

  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={3}><Card><CardContent><Typography variant="h6">Movies</Typography><Typography variant="h4" color="primary">{data.movies}</Typography></CardContent></Card></Grid>
      <Grid item xs={3}><Card><CardContent><Typography variant="h6">Actors</Typography><Typography variant="h4" color="primary">{data.actors}</Typography></CardContent></Card></Grid>
      <Grid item xs={3}><Card><CardContent><Typography variant="h6">Genres</Typography><Typography variant="h4" color="primary">{data.genres}</Typography></CardContent></Card></Grid>
      <Grid item xs={3}><Card><CardContent><Typography variant="h6">Directors</Typography><Typography variant="h4" color="primary">{data.directors || '-'}</Typography></CardContent></Card></Grid>
    </Grid>
  );
}
