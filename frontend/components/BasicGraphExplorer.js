import { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Button, 
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Movie as MovieIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

export default function BasicGraphExplorer() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('all');

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
    fetchData();
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const getNodeConnections = (nodeId) => {
    return data.links.filter(link => 
      link.source === nodeId || link.target === nodeId
    );
  };

  const getConnectedNodes = (nodeId) => {
    const connections = getNodeConnections(nodeId);
    return connections.map(link => {
      const connectedId = link.source === nodeId ? link.target : link.source;
      return data.nodes.find(node => node.id === connectedId);
    }).filter(Boolean);
  };

  const getNodeTypeColor = (label) => {
    const colors = {
      'Movie': '#003366',
      'Person': '#00AEEF',
      'Genre': '#FFBB28',
      'Keyword': '#FF8042',
      'Director': '#A28CFE',
      'Actor': '#FF6699'
    };
    return colors[label] || '#666';
  };

  const getNodeIcon = (label) => {
    switch(label) {
      case 'Movie': return <MovieIcon />;
      case 'Person': return <PersonIcon />;
      case 'Genre': return <CategoryIcon />;
      case 'Keyword': return <TagIcon />;
      default: return <ViewIcon />;
    }
  };

  const filteredNodes = data.nodes.filter(node => 
    filterType === 'all' || node.label === filterType
  );

  const nodeTypeCounts = data.nodes.reduce((acc, node) => {
    acc[node.label] = (acc[node.label] || 0) + 1;
    return acc;
  }, {});

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
            Unable to load the graph data. Please try refreshing.
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
        <Typography variant="h6">Graph Explorer (Compact View)</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          size="small"
        >
          Refresh
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {/* Graph Statistics */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom>Graph Overview</Typography>
              <Grid container spacing={2}>
                {Object.entries(nodeTypeCounts).map(([type, count]) => (
                  <Grid item xs={6} sm={3} key={type}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 1, 
                      borderRadius: 1,
                      bgcolor: `${getNodeTypeColor(type)}10`,
                      border: `1px solid ${getNodeTypeColor(type)}30`
                    }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: getNodeTypeColor(type),
                          mx: 'auto',
                          mb: 1
                        }}
                      >
                        {getNodeIcon(type)}
                      </Avatar>
                      <Typography variant="h6" color="primary">{count}</Typography>
                      <Typography variant="caption">{type}</Typography>
                    </Box>
                  </Grid>
                ))}
                <Grid item xs={6} sm={3}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1, 
                    borderRadius: 1,
                    bgcolor: 'grey.100',
                    border: '1px solid grey.300'
                  }}>
                    <Typography variant="h6" color="primary">{data.links.length}</Typography>
                    <Typography variant="caption">Relationships</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Node Browser */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, boxShadow: 1, height: '65vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Nodes</Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {Object.keys(nodeTypeCounts).map(type => (
                    <Tooltip key={type} title={`Show ${type}s only`}>
                      <Chip
                        label={type}
                        size="small"
                        variant={filterType === type ? "filled" : "outlined"}
                        onClick={() => setFilterType(filterType === type ? 'all' : type)}
                        sx={{ 
                          bgcolor: filterType === type ? getNodeTypeColor(type) : 'transparent',
                          color: filterType === type ? 'white' : getNodeTypeColor(type),
                          borderColor: getNodeTypeColor(type)
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <List dense>
                  {filteredNodes.slice(0, 100).map((node) => (
                    <ListItem 
                      key={node.id} 
                      sx={{ 
                        cursor: 'pointer',
                        borderRadius: 1,
                        mb: 0.5,
                        bgcolor: selectedNode?.id === node.id ? 'primary.50' : 'transparent',
                        border: selectedNode?.id === node.id ? 1 : 0,
                        borderColor: 'primary.main',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => handleNodeClick(node)}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            bgcolor: getNodeTypeColor(node.label),
                            fontSize: '0.75rem'
                          }}
                        >
                          {getNodeIcon(node.label)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" noWrap>
                            {node.name || node.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {node.label} • {getNodeConnections(node.id).length} connections
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip 
                          label={node.label} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: getNodeTypeColor(node.label),
                            color: getNodeTypeColor(node.label)
                          }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  {filteredNodes.length > 100 && (
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                            Showing first 100 nodes of {filteredNodes.length}
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            </Paper>
          </Grid>

          {/* Node Details */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, boxShadow: 1, height: '65vh', overflow: 'auto' }}>
              {selectedNode ? (
                <Box>
                  <Typography variant="h6" gutterBottom>Node Details</Typography>
                  
                  <Card sx={{ mb: 2, border: `2px solid ${getNodeTypeColor(selectedNode.label)}` }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            bgcolor: getNodeTypeColor(selectedNode.label)
                          }}
                        >
                          {getNodeIcon(selectedNode.label)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">
                            {selectedNode.name || selectedNode.title}
                          </Typography>
                          <Chip 
                            label={selectedNode.label} 
                            size="small" 
                            sx={{ 
                              bgcolor: getNodeTypeColor(selectedNode.label),
                              color: 'white'
                            }}
                          />
                        </Box>
                      </Box>
                      
                      {selectedNode.overview && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {selectedNode.overview.substring(0, 200)}...
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`${getNodeConnections(selectedNode.id).length} connections`} 
                          size="small" 
                          variant="outlined"
                        />
                        {selectedNode.vote_average && (
                          <Chip 
                            label={`Rating: ${selectedNode.vote_average.toFixed(1)}`} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>

                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Connected Nodes ({getConnectedNodes(selectedNode.id).length})
                  </Typography>
                  <List dense>
                    {getConnectedNodes(selectedNode.id).map((connectedNode) => (
                      <ListItem 
                        key={connectedNode.id} 
                        sx={{ 
                          cursor: 'pointer',
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => handleNodeClick(connectedNode)}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              width: 20, 
                              height: 20, 
                              bgcolor: getNodeTypeColor(connectedNode.label),
                              fontSize: '0.6rem'
                            }}
                          >
                            {getNodeIcon(connectedNode.label)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" noWrap>
                              {connectedNode.name || connectedNode.title}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {connectedNode.label}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'grey.300', mx: 'auto', mb: 2 }}>
                    <ViewIcon />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Select a node to view details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click on any node in the list to see its connections and details
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
} 