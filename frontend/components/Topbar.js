import { AppBar, Toolbar, Typography, IconButton, InputBase, Box, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Topbar() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Movie Knowledge Graph Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'rgba(255, 255, 255, 0.15)', 
              borderRadius: 2,
              px: 2,
              py: 0.5,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.25)',
              },
              transition: 'background 0.2s'
            }}>
              <InputBase
                placeholder="Search movies, actors, genres..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ 
                  color: 'inherit', 
                  minWidth: 250,
                  '& input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1
                  }
                }}
              />
              <IconButton 
                color="inherit" 
                type="submit"
                disabled={!search.trim()}
                sx={{ 
                  opacity: search.trim() ? 1 : 0.5,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </form>
          
          <Chip 
            label="Quick Search" 
            size="small" 
            variant="outlined" 
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}
            onClick={() => router.push('/search')}
          />
          
          <IconButton 
            color="inherit" 
            onClick={() => router.push('/profile')}
            sx={{ 
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
