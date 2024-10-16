import React, { useState } from 'react';

import CreateProductPage from './CreateProductPage';
import EditProductPage from './EditProductPage';
import ProductPageDelete from './ProductPageDelete';

const PageTab = () => {
  const [selectedTab, setSelectedTab] = useState('create');

  return (
    <div className="page_tab">
      <div className="tabs_line">
        <button className={`tab_btn ${selectedTab === 'create' ? 'active' : ''}`} onClick={() => setSelectedTab('create')}>Створити сторінку</button>
        <button className={`tab_btn ${selectedTab === 'edit' ? 'active' : ''}`} onClick={() => setSelectedTab('edit')}>Редагувати сторінку</button>
        <button className={`tab_btn ${selectedTab === 'delete' ? 'active' : ''}`} onClick={() => setSelectedTab('delete')}>Видалити сторінку</button>
      </div>
      
      <div className="content_create">
        {selectedTab === 'create' && <CreateProductPage />}
        {selectedTab === 'edit' && <EditProductPage />}
        {selectedTab === 'delete' && <ProductPageDelete />}
      </div>
    </div>
  );
};

export default PageTab;