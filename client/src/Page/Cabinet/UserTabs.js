import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cabinet.css'
import MainInfo from '../Cabinet/MainInfoTab';
import Orders from '../Cabinet/OrdersTab';
import Wishlist from '../Cabinet/WishlistTab';
import ViewedProducts from '../Cabinet/ViewProduct';

import SettingTab from '../Cabinet/Setting';

const UserTabs = () => {
  const [activeTab, setActiveTab] = useState('mainInfo');
  const history = useNavigate();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mainInfo':
        return <MainInfo />;
      case 'orders':
        return <Orders />;
      case 'wishlist':
        return <Wishlist />;
      case 'view':
        return <ViewedProducts />;
      case 'settings':
        return <SettingTab />;
      default:
        return null;
    }
  };

  return (
    <div className="user_tabs">
      <div className="tab_user-buttons">
        <button onClick={() => setActiveTab('mainInfo')} className={activeTab === 'mainInfo' ? 'active' : ''}>Особисті дані</button>
        <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>Замовлення</button>
        <button onClick={() => setActiveTab('wishlist')} className={activeTab === 'wishlist' ? 'active' : ''}>Обране</button>
        <button onClick={() => setActiveTab('view')} className={activeTab === 'view' ? 'active' : ''}>Переглянуте</button>
        <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'active' : ''}>Налаштування</button>
      </div>
      <div className="tab_user-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UserTabs;