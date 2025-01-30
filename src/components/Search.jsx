import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = ({ nodes, onNodeSelect, showSearch, setShowSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    // Configure Fuse for searching through node properties
    const fuseOptions = {
      keys: ['id', 'name', 'type', 'attributes.*'],
      threshold: 0.4,
      includeMatches: true
    };
    setFuse(new Fuse(nodes, fuseOptions));
  }, [nodes]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (fuse && value) {
      setResults(fuse.search(value).slice(0, 10)); // Limit to top 10 results
    } else {
      setResults([]);
    }
  };

  return (
    <div className={`fixed top-0 left-1/2 -translate-x-1/2 transform transition-transform duration-300 ${showSearch ? 'translate-y-0' : '-translate-y-full'}`}>
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800/80 backdrop-blur px-3 py-1 rounded-b-lg text-white"
      >
        {showSearch ? <X size={16} /> : <SearchIcon size={16} />}
      </button>
      <div className="bg-gray-800/80 backdrop-blur p-4 rounded-b-lg min-w-[400px]">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search nodes..."
            className="w-full bg-gray-700 text-white rounded px-3 py-2 pl-10"
          />
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {results.length > 0 && (
          <div className="mt-2 max-h-64 overflow-y-auto">
            {results.map(({ item, matches }) => (
              <button
                key={item.id}
                onClick={() => {
                  onNodeSelect(item);
                  setSearchTerm('');
                  setResults([]);
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
  );
};

export default Search;
