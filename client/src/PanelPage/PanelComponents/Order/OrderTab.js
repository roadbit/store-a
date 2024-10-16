import React, { useState } from 'react';

import OrderSummary from '../OrderSummary';
import CreateOrder from './CreateOrder';
import DeliveryOrder from './DeliveryOrder';
import OrderReceived from './OrderReceived';
import NotPicked from './NotPicked';
import Rejected from './Rejected';

const PageTab = () => {
  const [selectedTab, setSelectedTab] = useState('new-order');

  return (
    <div className="page_tab">
      <div className="tabs_line">
        <button className={`tab_btn ${selectedTab === 'new-order' ? 'active' : ''}`} onClick={() => setSelectedTab('new-order')}>Нові замовлення</button>
        <button className={`tab_btn ${selectedTab === 'created-order' ? 'active' : ''}`} onClick={() => setSelectedTab('created-order')}>Підтверджені</button>
        <button className={`tab_btn ${selectedTab === 'delivery-order' ? 'active' : ''}`} onClick={() => setSelectedTab('delivery-order')}>Відправлені</button>
        <button className={`tab_btn ${selectedTab === 'order-received' ? 'active' : ''}`} onClick={() => setSelectedTab('order-received')}>Отримані</button>
        <button className={`tab_btn ${selectedTab === 'not-picked' ? 'active' : ''}`} onClick={() => setSelectedTab('not-picked')}>Не забраті</button>
        <button className={`tab_btn ${selectedTab === 'rejected' ? 'active' : ''}`} onClick={() => setSelectedTab('rejected')}>Відхилені</button>
      </div>
      
      <div className="content_create">
        {selectedTab === 'new-order' && <OrderSummary />}
        {selectedTab === 'created-order' && <CreateOrder />}
        {selectedTab === 'delivery-order' && <DeliveryOrder />}
        {selectedTab === 'order-received' && <OrderReceived />}
        {selectedTab === 'not-picked' && <NotPicked />}
        {selectedTab === 'rejected' && <Rejected />}
      </div>
    </div>
  );
};

export default PageTab;