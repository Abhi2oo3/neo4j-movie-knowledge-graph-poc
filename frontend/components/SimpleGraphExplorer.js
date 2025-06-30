import { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Paper, IconButton, Tooltip } from '@mui/material';
import { Refresh as RefreshIcon, ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon, CenterFocusStrong as CenterIcon } from '@mui/icons-material';
import * as d3 from 'd3';

export default function SimpleGraphExplorer() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef(null);
  const simulationRef = useRef(null);

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

  useEffect(() => {
    if (!data.nodes.length || !svgRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create SVG with zoom support
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Add zoom behavior
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        svg.select('g').attr('transform', event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    // Create main group for zooming
    const g = svg.append('g');

    // Create simulation with better parameters
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(20))
      .alphaDecay(0.02)
      .velocityDecay(0.4);

    simulationRef.current = simulation;

    // Create links with better styling
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", d => d.type === 'HAS_GENRE' ? '5,5' : 'none');

    // Create nodes with enhanced styling
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter().append("circle")
      .attr("r", d => {
        // Size nodes based on type and importance
        switch(d.label) {
          case 'Movie': return 8;
          case 'Person': return 6;
          case 'Genre': return 5;
          case 'Keyword': return 4;
          default: return 5;
        }
      })
      .attr("fill", d => getNodeColor(d.label))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 3)
          .attr("r", d => {
            switch(d.label) {
              case 'Movie': return 10;
              case 'Person': return 8;
              case 'Genre': return 7;
              case 'Keyword': return 6;
              default: return 7;
            }
          });
        
        // Highlight connected links
        link
          .attr("stroke-opacity", l => 
            l.source.id === d.id || l.target.id === d.id ? 0.8 : 0.1
          )
          .attr("stroke-width", l => 
            l.source.id === d.id || l.target.id === d.id ? 3 : 1.5
          );
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("r", d => {
            switch(d.label) {
              case 'Movie': return 8;
              case 'Person': return 6;
              case 'Genre': return 5;
              case 'Keyword': return 4;
              default: return 5;
            }
          });
        
        // Reset links
        link
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 1.5);
      })
      .on("click", (event, d) => {
        console.log('Clicked node:', d);
        // Center on clicked node
        const transform = d3.zoomIdentity
          .translate(width / 2 - d.x * zoom, height / 2 - d.y * zoom)
          .scale(zoom);
        svg.transition().duration(750).call(zoomBehavior.transform, transform);
      });

    // Add node labels (only for important nodes)
    const labels = g.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(data.nodes.filter(d => d.label === 'Movie' || d.label === 'Person'))
      .enter().append("text")
      .text(d => d.name || d.title)
      .attr("font-size", "10px")
      .attr("fill", "#333")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("pointer-events", "none")
      .style("opacity", 0.7);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    // Add drag behavior
    node.call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup function
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [data, zoom]);

  const getNodeColor = (label) => {
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

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom().scaleBy, 1.5
    );
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom().scaleBy, 1/1.5
    );
  };

  const handleReset = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      d3.zoom().transform, d3.zoomIdentity
    );
  };

  const handleRefresh = () => {
    fetchData();
  };

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
        <Typography variant="h6">Interactive Graph Explorer</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Zoom In">
            <IconButton size="small" onClick={handleZoomIn}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton size="small" onClick={handleZoomOut}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset View">
            <IconButton size="small" onClick={handleReset}>
              <CenterIcon />
            </IconButton>
          </Tooltip>
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
            overflow: 'hidden',
            position: 'relative'
          }}>
            <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
            
            {/* Legend */}
            <Box sx={{ 
              position: 'absolute', 
              top: 10, 
              left: 10, 
              bgcolor: 'rgba(255,255,255,0.9)', 
              p: 1, 
              borderRadius: 1,
              border: '1px solid #ddd'
            }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                Node Types:
              </Typography>
              {Object.entries({
                'Movie': '#003366',
                'Person': '#00AEEF',
                'Genre': '#FFBB28',
                'Keyword': '#FF8042'
              }).map(([label, color]) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: color 
                  }} />
                  <Typography variant="caption">{label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          
          {data.nodes.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Graph contains {data.nodes.length} nodes and {data.links.length} relationships.
                Drag nodes to rearrange, scroll to zoom, and click nodes to center view.
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
} 