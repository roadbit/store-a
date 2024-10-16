import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, role, ...rest }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        if (currentTime > expirationTime) {
          localStorage.removeItem('token');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
        return false;
      }
    }
    return false;
  };

  const hasRequiredRole = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      return role ? user.role === role : true;
    }
    return false;
  };

  return isAuthenticated() && hasRequiredRole() ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;