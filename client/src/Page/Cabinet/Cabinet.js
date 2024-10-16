import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cabinet.css'
import Nav from '../../Components/Nav';
import Footer from '../../Components/Footer';
import UserTabs from '../Cabinet/UserTabs';
import ExitIcon from '../../Assets/other-icon/exit.svg'
const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const Cabinet = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${baseURL}/api/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Error fetching user data:', response.statusText);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <div className='load_page'>Loading...</div>;
  }

  return (
    <div className='main-container'>
      <Nav />
      <div className="container">
        <div className="top_cabinet">
          <h2>Привіт, {user.firstName} {user.lastName}!</h2>
          <button onClick={handleLogout}>Вийти<img src={ExitIcon} alt="ExitIcon" /></button>
        </div>
        <UserTabs />
        <Footer />
      </div>
    </div>
  );
};

export default Cabinet;