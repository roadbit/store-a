import React, { useState } from 'react';
import CreateRecSlider from './CreateRecSlider';
import DeleteRecSlider from './DeleteRecSlider';

const TabRecSlider = () => {
  const [selectedTab, setSelectedTab] = useState('create');

  return (
    <div className="slider-card-manager">
      <div className="tabs_line">
        <button className={`tab_btn ${selectedTab === 'create' ? 'active' : ''}`} onClick={() => setSelectedTab('create')}>Створити картку</button>
        <button className={`tab_btn ${selectedTab === 'delete' ? 'active' : ''}`} onClick={() => setSelectedTab('delete')}>Видалити картку</button>
      </div>
      
      <div className="content_slider-create">
        {selectedTab === 'create' && <CreateRecSlider />}
        {selectedTab === 'delete' && <DeleteRecSlider />}
      </div>
    </div>
  );
};

export default TabRecSlider;