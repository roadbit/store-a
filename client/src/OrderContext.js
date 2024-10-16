import React, { createContext, useState, useEffect } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [newOrderCount, setNewOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
      setOrders(storedOrders);
      setNewOrderCount(storedOrders.length);
    };

    fetchOrders();

    window.addEventListener('storage', fetchOrders);

    return () => {
      window.removeEventListener('storage', fetchOrders);
    };
  }, []);

  const addOrder = (newOrders) => {
    const updatedOrders = Array.isArray(newOrders) ? [...orders, ...newOrders] : [...orders, newOrders];
    setOrders(updatedOrders);
    setNewOrderCount(updatedOrders.length);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    localStorage.setItem('newOrderCount', updatedOrders.length.toString());
  };

  const clearNewOrderCount = () => {
    setNewOrderCount(0);
    localStorage.setItem('newOrderCount', '0');
  };

  return (
    <OrderContext.Provider value={{ orders, newOrderCount, addOrder, clearNewOrderCount }}>
      {children}
    </OrderContext.Provider>
  );
};