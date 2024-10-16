import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VisitChart from './PanelComponents/VisitChart';
import TabBlockFiller from './Filler/TabBlockFiller';
import OperatorChat from './Chat/OperatorChat';
import TabOrder from '../PanelPage/PanelComponents/Order/OrderTab';
import TabContact from '../PanelPage/Filler/TabContact/TabContact'
import AllReviews from './AllReviews'
import UpdateCredentials from './PanelComponents/UpdateCredentials'
import io from 'socket.io-client';

const socket = io('https://store-a-2.onrender.com');

const TabBlockPanel = ({ soundEnabled, notificationSound }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const notify = (message) => {
    toast(message);
    if (soundEnabled && notificationSound) {
      notificationSound.play().catch((error) => {
        console.error('Error playing sound:', error);
      });
    }
  };

  const handleNewMessage = () => {
    if (activeTab !== 7) {
      setUnreadMessages((prevCount) => prevCount + 1);
      notify('Нове повідомлення: ');
    }
  };

  useEffect(() => {
    socket.on('newMessageToOperator', handleNewMessage);

    return () => {
      socket.off('newMessageToOperator', handleNewMessage);
    };
  }, [activeTab, soundEnabled, notificationSound]);

  useEffect(() => {
    if (activeTab === 5) {
      setUnreadMessages(0);
    }
  }, [activeTab]);

  const tabs = [
    { label: 'Кількість відвідувань', content: <VisitChart /> },
    { label: 'Наповнення', content: <TabBlockFiller /> },
    { label: 'Замовлення', content: <TabOrder /> },
    { label: 'Відгуки користувачів', content: <AllReviews /> },
    { label: 'Соц-мережі і телефони', content: <TabContact /> },
    { label: `Чат підтримки ${unreadMessages > 0 ? `(${unreadMessages})` : ''}`, content: <OperatorChat socket={socket} notify={notify} soundEnabled={soundEnabled} notificationSound={notificationSound} /> },
    { label: 'Налаштування', content: <UpdateCredentials /> }
  ];

  return (
    <div className="tabs-container">
      <div className="tabs-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs[activeTab].content}
      </div>
      <ToastContainer />
    </div>
  );
};

export default TabBlockPanel;
