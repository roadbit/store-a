import React, { useState } from 'react';
import CreateTopSlider from './CreateTopSlider';
import DeleteTopSlider from './DeleteTopSlider';

const TabSliderTop = () => {
  const [selectedTab, setSelectedTab] = useState('create');

  return (
    <div className="slider-card-manager">
      <div className="tabs_line">
        <button className={`tab_btn ${selectedTab === 'create' ? 'active' : ''}`} onClick={() => setSelectedTab('create')}>Створити картку</button>
        <button className={`tab_btn ${selectedTab === 'delete' ? 'active' : ''}`} onClick={() => setSelectedTab('delete')}>Видалити картку</button>
      </div>
      
      <div className="content_slider-create">
        {selectedTab === 'create' && <CreateTopSlider />}
        {selectedTab === 'delete' && <DeleteTopSlider />}
      </div>
    </div>
  );
};

export default TabSliderTop;