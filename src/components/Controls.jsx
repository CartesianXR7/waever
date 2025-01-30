import React from 'react';
import { ChevronRight, Download, FileImage } from 'lucide-react';

const Controls = ({
  forceParams,
  setForceParams,
  filters,
  setFilters,
  nodeColors,
  onColorChange,
  onResetColors,
  onExport,
  showControls,
  setShowControls,
  availableTypes
}) => (
  <div className={`fixed right-0 top-1/2 -translate-y-1/2 transform transition-transform duration-300 ${showControls ? 'translate-x-0' : 'translate-x-full'}`}>
    <button
      onClick={() => setShowControls(!showControls)}
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-gray-800/80 backdrop-blur p-2 rounded-l-lg text-white"
    >
      <ChevronRight size={20} className={`transform transition-transform ${showControls ? 'rotate-180' : ''}`} />
    </button>
    <div className="bg-gray-800/80 backdrop-blur p-4 rounded-l-lg text-white w-[300px]">
      <div className="space-y-6">
        {/* Force Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Graph Controls</h3>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm">Collision Force</label>
              <span className="text-sm">{forceParams.collide}</span>
            </div>
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
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm">Force Strength</label>
              <span className="text-sm">{forceParams.strength}</span>
            </div>
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
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm">Link Distance</label>
              <span className="text-sm">{forceParams.distance}px</span>
            </div>
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

        {/* Node Types */}
        <div className="space-y-2">
          <h4 className="font-bold">Node Types</h4>
          {availableTypes.map((type) => (
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
                  style={{ backgroundColor: nodeColors[type] }}
                />
                <span className="flex-1">{type}</span>
                <input
                  type="color"
                  value={nodeColors[type] || '#000000'}
                  onChange={e => onColorChange(type, e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer ml-2"
                />
              </div>
            </label>
          ))}
          <button
            onClick={onResetColors}
            className="text-xs text-blue-400 hover:text-blue-300 mt-2"
          >
            Reset Colors
          </button>
        </div>

        {/* Export Options */}
        <div>
          <h4 className="font-bold mb-2">Export Graph</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onExport('png')}
              className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 rounded p-2"
            >
              <FileImage size={16} />
              <span>PNG</span>
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 rounded p-2"
            >
              <Download size={16} />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Controls;
