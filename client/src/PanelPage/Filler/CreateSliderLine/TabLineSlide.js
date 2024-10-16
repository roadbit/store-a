import React, { useState } from 'react';
import CreateSliderLine from './CreateSliderLine';
import EditSliderLine from './EditSliderLine';
import DeleteSliderLine from './DeleteSliderLine';

const TabLineSlider = () => {
  const [selectedTab, setSelectedTab] = useState('create');

  return (
    <div className="page_tab">
      <div className="tabs_line">
        <button className={`tab_btn ${selectedTab === 'create' ? 'active' : ''}`} onClick={() => setSelectedTab('create')}>Створити картку</button>
        <button className={`tab_btn ${selectedTab === 'edit' ? 'active' : ''}`} onClick={() => setSelectedTab('edit')}>Редагувати картку</button>
        <button className={`tab_btn ${selectedTab === 'delete' ? 'active' : ''}`} onClick={() => setSelectedTab('delete')}>Видалити картку</button>
      </div>
      
      <div className="content_slider-create">
        {selectedTab === 'create' && <CreateSliderLine />}
        {selectedTab === 'edit' && <EditSliderLine />}
        {selectedTab === 'delete' && <DeleteSliderLine />}
      </div>
    </div>
  );
};

export default TabLineSlider;
