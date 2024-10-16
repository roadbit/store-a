import React, { createContext, useState, useEffect } from 'react';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

export const UserCountContext = createContext();

export const UserCountProvider = ({ children }) => {
  const [userCount, setUserCount] = useState(0);
  const fetchUserCount = async () => {
    try {
      const response = await fetch(`${baseURL}/api/user/count`);
      const data = await response.json();
      setUserCount(data.count);
    } catch (error) {
      console.error('Помилка при отриманні кількості користувачів:', error);
    }
  };

  useEffect(() => {
    fetchUserCount();
    const interval = setInterval(fetchUserCount, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <UserCountContext.Provider value={userCount}>
      {children}
    </UserCountContext.Provider>
  );
};