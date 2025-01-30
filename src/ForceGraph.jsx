import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Search as SearchIcon, ChevronRight, Download, FileImage } from 'lucide-react';
import Fuse from 'fuse.js';

const ForceGraph = ({ data }) => {
  const svgRef = useRef();
  const gRef = useRef();
  const tooltipRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [legendColors, setLegendColors] = useState({});
  const [legend, setLegend] = useState([]);
  const [showControls, setShowControls] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [forceParams, setForceParams] = useState({
    collide: 65,
    strength: -8000,
    distance: 60
  });
  const [filters, setFilters] = useState({ 
    types: new Set(['Class', 'ObjectProperty', 'DatatypeProperty', 'AnnotationProperty', 'Individual']) 
  });

  useEffect(() => {
    if (data?.nodes) {
      const fuseOptions = {
        keys: ['id', 'name', 'type', 'attributes.*'],
        threshold: 0.4,
        includeMatches: true
      };
      setFuse(new Fuse(data.nodes, fuseOptions));
    }
  }, [data?.nodes]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (fuse && value) {
      setSearchResults(fuse.search(value).slice(0, 10));
    } else {
      setSearchResults([]);
    }
  };

  const handleZoom = (direction) => {
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svg.node());
    const newScale = direction === 'in' ? currentTransform.k * 1.2 : currentTransform.k / 1.2;
    
    svg.transition()
      .duration(300)
      .ease(d3.easeQuadOut)
      .call(
        d3.zoom().transform,
        d3.zoomIdentity
          .translate(currentTransform.x, currentTransform.y)
          .scale(newScale)
      );
  };

  const highlightNode = (node) => {
    const svg = d3.select(svgRef.current);
    
    // Reset all nodes
    svg.selectAll('.node')
      .attr('r', d => d.size || 12)
      .attr('stroke-width', 0)
      .attr('filter', null);
    
    if (node) {
      // Highlight selected node with glow and size increase
      svg.selectAll('.node')
        .filter(d => d.id === node.id)
        .attr('r', d => (d.size || 12) * 3.0)
        .attr('stroke', '#F15838')
        .attr('stroke-width', 3)
        .attr('filter', 'url(#glow)');
      
      // Center view on selected node with smooth transition
      const nodeEl = svg.selectAll('.node').filter(d => d.id === node.id).node();
      if (nodeEl) {
        const bbox = nodeEl.getBBox();
        const currentTransform = d3.zoomTransform(svg.node());
        const scale = currentTransform.k;
        const x = -bbox.x * scale + window.innerWidth / 2;
        const y = -bbox.y * scale + window.innerHeight / 2;
        
        svg.transition()
          .duration(750)
          .ease(d3.easeQuadOut)
          .call(
            d3.zoom().transform,
            d3.zoomIdentity
              .translate(x, y)
              .scale(scale)
          );
      }
    }
  };

  const exportGraph = (format) => {
    const svg = d3.select(svgRef.current);
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg.node());
    
    if (format === 'png') {
      const canvas = document.createElement('canvas');
      const box = svg.node().getBoundingClientRect();
      canvas.width = box.width;
      canvas.height = box.height;
      const ctx = canvas.getContext('2d');
      const image = new Image();
      image.onload = () => {
        ctx.fillStyle = '#151515';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
        const link = document.createElement('a');
        link.download = 'graph.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      image.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
    } else if (format === 'pdf') {
      const blob = new Blob([svgString], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'graph.pdf';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    if (!data) return;

    const { nodes, edges } = data;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const g = d3.select(gRef.current);
    const tooltip = d3.select(tooltipRef.current);

    // Define color scale for node types
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
    const nodeTypes = Array.from(new Set(nodes.map((node) => node.type || 'unknown')));
    const typeColorMap = Object.fromEntries(nodeTypes.map((type, i) => [type, colorScale(i)]));
    setLegend(nodeTypes);
    setLegendColors(typeColorMap);

    // Filter nodes based on selected types
    const filteredNodes = nodes.filter(node => filters.types.has(node.type));
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = edges.filter(e => 
      nodeIds.has(e.source.id || e.source) && nodeIds.has(e.target.id || e.target)
    );

    // D3 force simulation
    const simulation = d3
      .forceSimulation(filteredNodes)
      .force(
        'link',
        d3.forceLink(filteredEdges)
          .id((d) => d.id)
          .distance(forceParams.distance)
          .strength(1)
      )
      .force('charge', d3.forceManyBody().strength(forceParams.strength))
      .force(
        'x',
        d3.forceX((d) => (nodeTypes.indexOf(d.type) / nodeTypes.length) * width).strength(0.5)
      )
      .force('y', d3.forceY(height / 2).strength(0.5))
      .force('collision', d3.forceCollide(forceParams.collide))
      .on('tick', () => {
        g.selectAll('.link')
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        g.selectAll('.node')
          .attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y);
      });

    // Clear previous elements
    g.selectAll('*').remove();

    // Draw edges
    g.selectAll('.link')
      .data(filteredEdges)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', 2);

    // Draw nodes
    g.selectAll('.node')
      .data(filteredNodes)
      .join('circle')
      .attr('class', 'node')
      .attr('r', (d) => d.size || 12)
      .attr('fill', (d) => typeColorMap[d.type || 'unknown'])
      .on('mouseover', (event, d) => {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`)
          .style('opacity', 1)
          .html(`
            <strong>${d.name || d.id || 'N/A'}</strong><br>
            ${d.type ? `Type: ${d.type}` : ''}
          `);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      })
      .on('click', (event, d) => {
        setSelectedNode(d);
        highlightNode(d);
        event.stopPropagation();
      })
      .call(
        d3.drag()
          .on('start', (event) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          })
          .on('drag', (event) => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on('end', (event) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          })
      );

      // Add zoom and pan
    const zoom = d3.zoom()
    .scaleExtent([0.01, 7])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Add click handler to clear selection
  svg.on('click', (event) => {
    if (event.target.tagName === 'svg') {
      setSelectedNode(null);
      highlightNode(null);
    }
  });

  // Re-highlight selected node if exists
  if (selectedNode) {
    highlightNode(selectedNode);
  }

  return () => {
    simulation.stop();
  };
}, [data, filters, forceParams]);

return (
  <div className="relative">
    {/* Search Component */}
    <div className={`fixed top-0 left-1/2 -translate-x-1/2 transform transition-transform duration-300 ${showSearch ? 'translate-y-0' : '-translate-y-full'}`}>
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800/80 backdrop-blur px-3 py-1 rounded-b-lg text-white"
      >
        {showSearch ? 'Close' : <SearchIcon size={16} />}
      </button>
      <div className="bg-gray-800/80 backdrop-blur p-4 rounded-b-lg min-w-[400px]">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search nodes..."
            className="w-full bg-gray-700 text-white rounded px-3 py-2 pl-10 text-sm"
          />
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {searchResults.length > 0 && (
          <div className="mt-2 max-h-64 overflow-y-auto">
            {searchResults.map(({ item, matches }) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedNode(item);
                  highlightNode(item);
                  setSearchTerm('');
                  setSearchResults([]);
                  setShowSearch(false);
                }}
                className="w-full text-left p-2 hover:bg-gray-700/50 text-white rounded mb-1 text-sm"
              >
                <div className="font-medium">{item.name || item.id}</div>
                <div className="text-xs text-gray-400">
                  Type: {item.type}
                  {matches?.length > 0 && (
                    <span className="ml-2">
                      Matched: {matches[0].key}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Controls Panel */}
    <div className={`fixed right-0 top-1/2 -translate-y-1/2 transform transition-transform duration-300 ${showControls ? 'translate-x-0' : 'translate-x-full'}`}>
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-gray-800/80 backdrop-blur p-2 rounded-l-lg text-white"
      >
        <ChevronRight size={20} className={`transform transition-transform ${showControls ? 'rotate-180' : ''}`} />
      </button>
      <div className="bg-gray-800/80 backdrop-blur p-4 rounded-l-lg text-white w-[300px]">
        <div className="space-y-6">
          <h3 className="panel-title text-base">CONTROLS</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">Collision Force: {forceParams.collide}</label>
              <input
                type="range"
                min="20"
                max="200"
                value={forceParams.collide}
                onChange={e => setForceParams(p => ({...p, collide: +e.target.value}))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Force Strength: {forceParams.strength}</label>
              <input
                type="range"
                min="-10000"
                max="-1000"
                value={forceParams.strength}
                onChange={e => setForceParams(p => ({...p, strength: +e.target.value}))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Link Distance: {forceParams.distance}</label>
              <input
                type="range"
                min="30"
                max="200"
                value={forceParams.distance}
                onChange={e => setForceParams(p => ({...p, distance: +e.target.value}))}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="panel-title text-sm">Node Types</h4>
            {legend.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.types.has(type)}
                  onChange={e => {
                    setFilters(prev => {
                      const newTypes = new Set(prev.types);
                      if (e.target.checked) {
                        newTypes.add(type);
                      } else {
                        newTypes.delete(type);
                      }
                      return { ...prev, types: newTypes };
                    });
                  }}
                  className="mr-2"
                />
                <div className="flex items-center flex-1">
                  <span
                    className="w-3 h-3 rounded-full inline-block mr-2"
                    style={{ backgroundColor: legendColors[type] }}
                  />
                  <span className="text-sm flex-1">{type}</span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={legendColors[type] || '#000000'}
                      onChange={e => setLegendColors(prev => ({
                        ...prev,
                        [type]: e.target.value
                      }))}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      placeholder="#RRGGBB"
                      value={legendColors[type] || ''}
                      onChange={e => {
                        if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                          setLegendColors(prev => ({
                            ...prev,
                            [type]: e.target.value
                          }));
                        }
                      }}
                      className="w-20 bg-gray-700 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Export Options */}
          <div>
            <h4 className="panel-title text-sm mb-2">Export Graph</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => exportGraph('png')}
                className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 rounded p-2"
              >
                <FileImage size={16} />
                <span className="text-sm">PNG</span>
              </button>
              <button
                onClick={() => exportGraph('pdf')}
                className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 rounded p-2"
              >
                <Download size={16} />
                <span className="text-sm">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Tooltip */}
    <div
      ref={tooltipRef}
      className="tooltip absolute z-10 p-3 opacity-0 transition-opacity"
    />

    {/* Legend */}
    <div className="absolute bottom-4 left-4 bg-gray-800/80 backdrop-blur p-4 rounded-lg text-white">
      <h4 className="panel-title text-sm mb-2">LEGEND</h4>
      <ul className="space-y-2 text-sm">
        {legend.map((type) => (
          <li key={type} className="flex items-center gap-2">
            <span
              className="w-4 h-4 inline-block rounded-full"
              style={{ backgroundColor: legendColors[type] }}
            />
            {type}
          </li>
        ))}
      </ul>
    </div>

    {/* SVG Visualization */}
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ backgroundColor: '#151515' }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g ref={gRef} />
    </svg>

    {/* Selected Node Details */}
    {selectedNode && (
      <div
        className="absolute top-4 left-4 bg-gray-800/80 backdrop-blur text-white p-4 rounded-lg shadow-xl"
        style={{
          maxWidth: '300px',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
        }}
      >
        <h4 className="panel-title text-sm mb-2">NODE DETAILS</h4>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-sm"
          onClick={() => {
            setSelectedNode(null);
            highlightNode(null);
          }}
        >
          ✖
        </button>
        <ul className="space-y-1 text-xs">
          {Object.entries(selectedNode).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Zoom Controls */}
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      <button 
        onClick={() => handleZoom('in')}
        className="zoom-button bg-gray-800/80 backdrop-blur rounded hover:bg-gray-700/80 text-white"
      >
        +
      </button>
      <button 
        onClick={() => handleZoom('out')}
        className="zoom-button bg-gray-800/80 backdrop-blur rounded hover:bg-gray-700/80 text-white"
      >
        −
      </button>
    </div>
  </div>
);
};

export default ForceGraph;
