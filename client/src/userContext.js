import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [orderUser, setOrderUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${baseURL}/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user data', error);
        }
      }
    };

    const fetchOrderUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${baseURL}/api/order-user`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setOrderUser(response.data);
        } catch (error) {
          console.error('Failed to fetch order user data', error);
        }
      }
    };

    fetchUser();
    fetchOrderUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, orderUser }}>
      {children}
    </UserContext.Provider>
  );
};