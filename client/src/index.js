import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './reset.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from './SocketContext';
import { CartProvider } from './CartContext';
import { ReviewProvider } from './ReviewContext';
import { ChatProvider } from './PanelPage/Chat/ChatContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <SocketProvider>
        <CartProvider>
          <ReviewProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </ReviewProvider>
        </CartProvider>
      </SocketProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);