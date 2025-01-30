export const calculateLinkDistance = (link, baseDistance) => {
  return baseDistance * (1 + (link.weight || 0));
};

export const getNodeColor = node => {
  const colors = {
    Class: '#00ff87',
    Property: '#ff0087',
    Individual: '#0087ff',
    AnnotationProperty: '#ff00ff'
  };
  return colors[node.type] || '#999';
};

export const getEdgeColor = edge => {
  const colors = {
    subClassOf: '#666',
    domainOf: '#ff0087',
    rangeOf: '#0087ff'
  };
  return colors[edge.type] || '#999';
};

export const countConnections = (node, edges) => {
  return edges.filter(e => e.source === node || e.target === node).length;
};

export const createEdgePath = (d, curved = true) => {
  if (!curved) {
    return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
  }
  
  const dx = d.target.x - d.source.x;
  const dy = d.target.y - d.source.y;
  const dr = Math.sqrt(dx * dx + dy * dy);
  return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
};
