import React, { useState, useEffect } from 'react';

const DocumentSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="document-search">
      <div className="search-header">
        <h3>🔍 Search & Filter</h3>
      </div>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search documents by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              type="button" 
              className="clear-search"
              onClick={handleClear}
            >
              ❌
            </button>
          )}

        </div>
        
        <div className="search-actions">
          <button type="submit" className="search-button">
            🔍 Search
          </button>
          <button type="button" onClick={handleClear} className="clear-button">
            🗑️ Clear
          </button>
        </div>
      </form>
      

    </div>
  );
};

export default DocumentSearch;