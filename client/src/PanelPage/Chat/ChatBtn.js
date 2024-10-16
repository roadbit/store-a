import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import './chat.css';

import ChatIcon from '../../Assets/chat-icon/chat-icon.svg';
import CloseIcon from '../../Assets/chat-icon/close-icon.svg';
import SendIcon from '../../Assets/chat-icon/send-icon.svg';
import HideIcon from '../../Assets/chat-icon/w-icon.svg';

import notificationSoundFile from '../../Assets/notifications/not.ogg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const ChatBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [operatorTyping, setOperatorTyping] = useState(false);
  const [userId] = useState(uuidv4());
  const socketRef = useRef(null);
  const notificationSoundRef = useRef(null);
  const chatBodyRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(baseURL, {
        withCredentials: true,
      });

      socketRef.current.emit('join', userId);

      socketRef.current.on('newMessage', (message) => {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.find((msg) => msg.id === message.id);
          if (messageExists) return prevMessages;
          return [...prevMessages, message];
        });

        if (message.isOperator && notificationSoundRef.current) {
          notificationSoundRef.current.play().catch((error) => {
            console.error('Error playing sound:', error);
          });
        }
      });

      socketRef.current.on('operatorTyping', () => {
        setOperatorTyping(true);
      });

      socketRef.current.on('operatorStoppedTyping', () => {
        setOperatorTyping(false);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]);

  useEffect(() => {
    notificationSoundRef.current = new Audio(notificationSoundFile);
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);
  const closeChat = () => {
    setIsOpen(false);
    setMessages([]);
  };

  const sendMessage = () => {
    if (text.trim() && username.trim()) {
      const newMessage = { id: uuidv4(), userId, text, username, isOperator: false };
      socketRef.current.emit('sendMessage', newMessage);
      setMessages((prevMessages) => {
        const messageExists = prevMessages.find((msg) => msg.id === newMessage.id);
        if (messageExists) return prevMessages;
        return [...prevMessages, newMessage];
      });
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '26px';
      }
    }
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  const formatMessageWithLinks = (message) => {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    const parts = message.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="chat-container">
      <button className="chat-button" onClick={toggleChat}>
        Допомога
        <img src={ChatIcon} alt="Chat Icon" />
      </button>
      {isOpen && (
        <div className="chat-modal">
          <div className="chat-header">
            <button className="hide" onClick={toggleChat}>
              <img src={HideIcon} alt="Hide Icon" />
            </button>
            <button className="close" onClick={closeChat}>
              <img src={CloseIcon} alt="Close Icon" />
            </button>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={msg.isOperator ? 'operator-message' : 'user-message'}
              >
                <strong>{msg.username}: </strong>
                {formatMessageWithLinks(msg.text)}
              </div>
            ))}
            {operatorTyping && <div className="typing-indicator">Оператор друкує...</div>}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ваше ім'я"
            />
            <div className="msg_btn">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  autoResizeTextarea();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Повідомлення"
                style={{ minHeight: '26px', maxHeight: '75px', overflowY: 'auto' }}
              />
              <button onClick={sendMessage}>
                <img src={SendIcon} alt="Send Icon" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBtn;