import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState({});
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(baseURL);
    setSocket(newSocket);

    const handleNewMessage = (message) => {
      const { userId } = message;
      setConversations((prevConversations) => ({
        ...prevConversations,
        [userId]: [...(prevConversations[userId] || []), message]
      }));
      setUnreadMessages((prevCount) => prevCount + 1);
    };

    newSocket.on('newMessageToOperator', handleNewMessage);

    return () => {
      newSocket.off('newMessageToOperator', handleNewMessage);
      newSocket.disconnect();
    };
  }, []);

  const clearUnreadMessages = () => {
    setUnreadMessages(0);
  };

  return (
    <ChatContext.Provider value={{ conversations, setConversations, socket, clearUnreadMessages }}>
      {children}
    </ChatContext.Provider>
  );
};