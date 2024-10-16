import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

const socket = io('http://localhost:5000');

export const SocketProvider = ({ children }) => {
  const [userCount, setUserCount] = useState(0);
  const [onlineUserCount, setOnlineUserCount] = useState(0);

  useEffect(() => {
    socket.emit('requestUserCount');

    socket.on('userCount', (count) => {
      setUserCount(count);
    });

    socket.on('onlineRegisteredUsersCount', (count) => {
      setOnlineUserCount(count);
    });

    return () => {
      socket.off('userCount');
      socket.off('onlineRegisteredUsersCount');
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, userCount, onlineUserCount }}>
      {children}
    </SocketContext.Provider>
  );
};