import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatContext } from './ChatContext';

import DeleteIcon from '../../Assets/icon-nav/delete-icon.svg'
import SendIcon from '../../Assets/chat-icon/send-icon.svg'

const OperatorChat = ({ socket, notify, soundEnabled, notificationSound }) => {
  const { conversations, setConversations, clearUnreadMessages } = useContext(ChatContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [operatorName, setOperatorName] = useState(localStorage.getItem('operatorName') || '');
  const [text, setText] = useState('');
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      const { userId, id: messageId } = message;

      setConversations((prevConversations) => {
        const existingMessages = prevConversations[userId] || [];
        const isDuplicate = existingMessages.some((msg) => msg.id === messageId);

        if (isDuplicate) {
          return prevConversations;
        }
        return {
          ...prevConversations,
          [userId]: [...existingMessages, { ...message, key: messageId }]
        };
      });

      if (selectedChat !== userId) {
        if (typeof notify === 'function') {
          notify('Нове повідомлення: ' + message.text);
          if (soundEnabled && notificationSound) {
            notificationSound.play().catch((error) => {
              console.error('Error playing sound:', error);
            });
          }
        } else {
          console.error('notify is not a function');
        }
      }
    };

    socket.on('newMessageToOperator', handleNewMessage);

    return () => {
      socket.off('newMessageToOperator', handleNewMessage);
    };
  }, [socket, setConversations, selectedChat, notify, soundEnabled, notificationSound]);

  const selectChat = (userId) => {
    setSelectedChat(userId);
    setText('');
    clearUnreadMessages(userId);
  };

  const sendMessage = useCallback(() => {
    if (text.trim() && selectedChat && socket) {
      const newMessage = {
        id: uuidv4(),
        userId: selectedChat,
        text,
        isOperator: true,
        username: operatorName
      };

      setConversations((prevConversations) => ({
        ...prevConversations,
        [selectedChat]: [...(prevConversations[selectedChat] || []), newMessage]
      }));

      setText('');
      socket.emit('sendMessage', newMessage);
    }
  }, [text, selectedChat, operatorName, socket, setConversations]);

  const handleTyping = useCallback(() => {
    if (selectedChat && socket) {
      socket.emit('operatorTyping', selectedChat);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit('operatorStoppedTyping', selectedChat);
      }, 1000);
    }
  }, [selectedChat, socket]);

  const handleOperatorNameChange = (e) => {
    const name = e.target.value;
    setOperatorName(name);
    localStorage.setItem('operatorName', name);
  };

  const deleteChat = (userId) => {
    setConversations((prevConversations) => {
      const { [userId]: deletedChat, ...remainingConversations } = prevConversations;
      return remainingConversations;
    });
    if (selectedChat === userId) {
      setSelectedChat(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="operator-chat-container">
      <div className="chat-list">
        {Object.keys(conversations).map((userId) => (
          <div
            key={userId}
            className={`chat-item ${userId === selectedChat ? 'selected' : ''}`}
            onClick={() => selectChat(userId)}
          >
            {conversations[userId]?.[0]?.username}
            <button onClick={(e) => { e.stopPropagation(); deleteChat(userId); }}>
              <img src={DeleteIcon} alt="Видалити" />
            </button>
          </div>
        ))}
      </div>
      <div className="chat-window">
        <p>Ім'я оператора</p>
        <input
          className='operator_name-input'
          type="text"
          value={operatorName}
          onChange={handleOperatorNameChange}
        />
        <div className="chat_body">
          {selectedChat &&
            conversations[selectedChat]?.map((msg) => (
              <div key={msg.id} className={msg.isOperator ? 'operator-message' : 'user-message'}>
                {msg.isOperator ? operatorName : msg.username}: {msg.text}
              </div>
            ))}
        </div>
        <div className="chat_footer">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Повідомлення"
          />
          <button onClick={sendMessage}><img src={SendIcon} alt="Send" /></button>
        </div>
      </div>
    </div>
  );
};

export default OperatorChat;