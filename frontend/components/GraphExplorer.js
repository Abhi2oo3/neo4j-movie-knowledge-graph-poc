import dynamic from 'next/dynamic';
import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Paper } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

// Dynamic import with proper error handling
const ForceGraph2D = dynamic(
  () => import('react-force-graph').then(mod => mod.ForceGraph2D),
  { 
    ssr: false,
    loading: () => <CircularProgress />
  }
);

export default function GraphExplorer() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [graphKey, setGraphKey] = useState(0); // Force re-render key

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/graph');
      const d = await response.json();
      
      if (response.ok) {
        setData({
          nodes: Array.isArray(d.nodes) ? d.nodes : [],
          links: Array.isArray(d.links) ? d.links : [],
        });
      } else {
        setError('Failed to load graph data');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Graph fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setGraphKey(prev => prev + 1); // Force component re-render
    fetchData();
  };

  const handleNodeClick = useCallback((node) => {
    console.log('Clicked node:', node);
  }, []);

  const handleLinkClick = useCallback((link) => {
    console.log('Clicked link:', link);
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Graph Explorer
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Unable to load the graph visualization. Please try refreshing.
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh Graph
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Graph Explorer</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 2, boxShadow: 2 }}>
          <Box sx={{ 
            width: '100%', 
            height: '70vh', 
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            <ForceGraph2D
              key={graphKey} // Force re-render when key changes
              graphData={data}
              nodeLabel={node => `${node.label}: ${node.name || node.title}`}
              linkLabel={link => link.type}
              nodeAutoColorBy="label"
              nodeRelSize={6}
              linkWidth={2}
              linkColor={() => '#999'}
              onNodeClick={handleNodeClick}
              onLinkClick={handleLinkClick}
              cooldownTicks={100}
              onEngineStop={() => console.log('Graph engine stopped')}
              width={window.innerWidth - 400}
              height={window.innerHeight - 300}
            />
          </Box>
          
          {data.nodes.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Graph contains {data.nodes.length} nodes and {data.links.length} relationships.
                Click on nodes or links to explore the connections.
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
