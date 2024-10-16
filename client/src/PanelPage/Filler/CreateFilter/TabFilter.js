import React, { useState, useEffect } from 'react';
import CheckboxManager from './CheckboxManager';
import AddCheckboxes from './AddCheckboxes';
import DeleteCheckboxes from './DeleteCheckboxes';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const TabFilters = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [subcategories, setSubcategories] = useState([]);
  const [filterGroupsBySubcategory, setFilterGroupsBySubcategory] = useState([]);

  useEffect(() => {
    axios.get(`${baseURL}/podcategorypages`)
      .then(response => setSubcategories(response.data))
      .catch(error => console.error('Error loading subcategories:', error));
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tabs_line">
        <button className={`tab_btn ${activeTab === 'create' ? 'active' : ''}`} onClick={() => handleTabChange('create')}>Створити групи фільтрів</button>
        <button className={`tab_btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => handleTabChange('add')}>Додати фільтр</button>
        <button className={`tab_btn ${activeTab === 'delete' ? 'active' : ''}`} onClick={() => handleTabChange('delete')}>Видалити фільтр</button>
      </div>

      {activeTab === 'create' && (
        <CheckboxManager subcategories={subcategories} />
      )}
      {activeTab === 'add' && (
        <AddCheckboxes subcategories={subcategories} filterGroupsBySubcategory={filterGroupsBySubcategory} />
      )}
      {activeTab === 'delete' && (
        <DeleteCheckboxes subcategories={subcategories} filterGroupsBySubcategory={filterGroupsBySubcategory} />
      )}
    </div>
  );
};

export default TabFilters;