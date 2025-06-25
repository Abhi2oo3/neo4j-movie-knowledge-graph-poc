import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function GenresTab() {
  const [data, setData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/genres')
      .then(res => res.json())
      .then(d => {
        console.log('Genres API response:', d);
        if (!Array.isArray(d)) {
          setData([]);
          setGenres([]);
          setLoading(false);
          return;
        }
        setData(d);
        setGenres(d.map(g => g.genre));
        setLoading(false);
      });
  }, []);

  const filtered = selected.length ? data.filter(d => selected.includes(d.genre)) : data;

  return (
    <Box>
      <Typography variant="h6" mb={2}>Movies per Genre</Typography>
      <FormControl sx={{ mb: 2, minWidth: 240 }} size="small">
        <InputLabel>Filter Genres</InputLabel>
        <Select
          multiple
          value={selected}
          onChange={e => setSelected(e.target.value)}
          input={<OutlinedInput label="Filter Genres" />}
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map(value => <Chip key={value} label={value} />)}
            </Box>
          )}
        >
          {genres.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
        </Select>
      </FormControl>
      {loading ? <CircularProgress /> : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filtered} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
            <XAxis dataKey="genre" angle={-30} textAnchor="end" height={60} interval={0} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#003366" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
} 