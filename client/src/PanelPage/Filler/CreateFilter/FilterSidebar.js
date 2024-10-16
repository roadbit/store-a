import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../../Page/page.css'
import CloseIcon from '../../../Assets/chat-icon/close-icon.svg'

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const FilterSidebar = ({ subcategoryId, onApplyFilters }) => {
  const [filters, setFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (subcategoryId) {
      axios
        .get(`${baseURL}/api/filters/${subcategoryId}`)
        .then((response) => {
          const formattedFilters = response.data.reduce((acc, group) => {
            acc[group.groupName] = group.checkboxes;
            return acc;
          }, {});
          setFilters(formattedFilters);
          setSelectedFilters({});
        })
        .catch((error) => console.error('Error loading filters:', error));
    }
  }, [subcategoryId]);

  const handleCheckboxChange = (group, checkbox) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [group]: {
        ...prevState[group],
        [checkbox]: !prevState[group]?.[checkbox],
      },
    }));
  };

  const handleApply = () => {
    setShowSidebar(false);
    onApplyFilters(selectedFilters);
  };

  const handleReset = () => {
    setSelectedFilters({});
    setShowSidebar(false);
    onApplyFilters({});
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    };

    if (showSidebar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSidebar]);

  return (
    <>
      <button className="btn_filter-open" onClick={() => setShowSidebar((prev) => !prev)}>Фільтр</button>
      <div className={`sidebar ${showSidebar ? 'sidebar-open' : ''}`} ref={sidebarRef}>
        <div className="sidebar-content">
          <div className="top_sidebar">
            <p>Фільтри</p>
            <button className="close-sidebar-btn" onClick={() => setShowSidebar(false)}><img src={CloseIcon} /></button>
          </div>
          <div className="check_input-container">
            <div className="checkbox-groups">
              {Object.entries(filters).map(([group, checkboxes]) => (
                <div key={group}>
                  <h3>{group}</h3>
                  {(Array.isArray(checkboxes) ? checkboxes : []).map((checkbox) => (
                    <label key={checkbox}>
                      <input
                        type="checkbox"
                        checked={!!selectedFilters[group]?.[checkbox]}
                        onChange={() => handleCheckboxChange(group, checkbox)}
                      />
                      {checkbox}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="bottom_sidebar">
            <button className="apply-btn" onClick={handleApply}>Застосувати</button>
            <button className="reset-btn" onClick={handleReset}>Скинути</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;