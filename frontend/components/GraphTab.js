import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem, Slider, OutlinedInput, Chip } from '@mui/material';

const ForceGraph2D = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph2D), { ssr: false });

export default function GraphTab() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [popRange, setPopRange] = useState([0, 100]);
  const [revRange, setRevRange] = useState([0, 1000000000]);

  useEffect(() => {
    fetch('/api/genres')
      .then(res => res.json())
      .then(d => {
        console.log('GraphTab genres API response:', d);
        if (!Array.isArray(d)) {
          setGenres([]);
          return;
        }
        setGenres(d.map(g => g.genre));
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedGenres.length) params.append('genres', selectedGenres.join(','));
    params.append('popMin', popRange[0]);
    params.append('popMax', popRange[1]);
    params.append('revMin', revRange[0]);
    params.append('revMax', revRange[1]);
    fetch(`/api/graph?${params.toString()}`)
      .then(res => res.json())
      .then(d => {
        setData({
          nodes: Array.isArray(d.nodes) ? d.nodes : [],
          links: Array.isArray(d.links) ? d.links : [],
        });
        setLoading(false);
      });
  }, [selectedGenres, popRange, revRange]);

  return (
    <Box>
      <Typography variant="h6" mb={2}>Interactive Graph</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Genres</InputLabel>
          <Select
            multiple
            value={selectedGenres}
            onChange={e => setSelectedGenres(e.target.value)}
            input={<OutlinedInput label="Genres" />}
            renderValue={selected => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map(value => <Chip key={value} label={value} />)}
              </Box>
            )}
          >
            {genres.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
          </Select>
        </FormControl>
        <Box sx={{ minWidth: 180 }}>
          <Typography>Popularity</Typography>
          <Slider
            value={popRange}
            min={0}
            max={100}
            onChange={(_, v) => setPopRange(v)}
            valueLabelDisplay="auto"
          />
        </Box>
        <Box sx={{ minWidth: 220 }}>
          <Typography>Revenue</Typography>
          <Slider
            value={revRange}
            min={0}
            max={1000000000}
            step={1000000}
            onChange={(_, v) => setRevRange(v)}
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>
      {loading ? <CircularProgress /> : (
        <ForceGraph2D
          graphData={data}
          nodeLabel={node => `${node.label}: ${node.name || node.title}`}
          linkLabel={link => link.type}
          nodeAutoColorBy="label"
          width={window.innerWidth - 360}
          height={window.innerHeight - 240}
        />
      )}
    </Box>
  );
} 