import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './nav.css';
import SearchIcon from '../Assets/icon-nav/search.svg';

function SearchPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search_input">
      <input
        type="text"
        placeholder="Пошук"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button className="search_btn" onClick={handleSearch}>
        <img src={SearchIcon} alt="Пошук" />
      </button>
    </div>
  );
}

export default SearchPanel;