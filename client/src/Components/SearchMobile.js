import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './nav.css';
import SearchIcon from '../Assets/icon-nav/search.svg';
import CloseIcon from '../Assets/chat-icon/close-icon.svg';

function SearchPanelMobile({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='search_input-mobile'>
      <div className="inner_search">
        <input
          type="text"
          placeholder="Пошук..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className='search_btn' onClick={handleSearch}>
          <img src={SearchIcon} alt="Пошук" />
        </button>
        <button className='close_btn-search' onClick={onClose}>
          <img src={CloseIcon} alt="Закрити" />
        </button>
      </div>
    </div>
  );
}

export default SearchPanelMobile;