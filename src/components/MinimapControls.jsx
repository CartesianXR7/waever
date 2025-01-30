import React from 'react';
import { ZoomIn, ZoomOut, Minimize } from 'lucide-react';

const MinimapControls = ({ onZoomFit }) => (
  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
    <button 
      className="bg-gray-800/80 backdrop-blur p-2 rounded hover:bg-gray-700/80"
      onClick={onZoomFit}
      title="Fit to view"
    >
      <Minimize size={20} />
    </button>
    <button 
      className="bg-gray-800/80 backdrop-blur p-2 rounded hover:bg-gray-700/80"
      onClick={() => {
        // Implement zoom in
      }}
      title="Zoom in"
    >
      <ZoomIn size={20} />
    </button>
    <button 
      className="bg-gray-800/80 backdrop-blur p-2 rounded hover:bg-gray-700/80"
      onClick={() => {
        // Implement zoom out
      }}
      title="Zoom out"
    >
      <ZoomOut size={20} />
    </button>
  </div>
);

export default MinimapControls;
