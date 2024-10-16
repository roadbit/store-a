import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabBlockPanel from '../PanelPage/TabBlockPanel';
import notificationSoundFile from '../Assets/notifications/not.ogg';
import Clock from './PanelComponents/Clock';
import ExitIcon from '../Assets/other-icon/exit.svg';

import SoundOn from '../Assets/other-icon/sound-on.svg';
import SoundOff from '../Assets/other-icon/sound-off.svg';

import './panel.css';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function PanelPage() {
  const navigate = useNavigate();

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const savedState = localStorage.getItem('soundEnabled');
    return savedState === 'true';
  });

  const [notificationSound, setNotificationSound] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const enableSound = () => {
    const sound = new Audio(notificationSoundFile);
    sound.play().catch((error) => {
      console.error('Error playing sound on first click:', error);
    });
    setNotificationSound(sound);
    setSoundEnabled(true);
    localStorage.setItem('soundEnabled', 'true');
  };

  const disableSound = () => {
    setSoundEnabled(false);
    localStorage.setItem('soundEnabled', 'false');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/api/login-panel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (result.success) {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Помилка авторизації. Спробуйте ще раз.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <h2>Авторизація</h2>
          <input
            type="text"
            placeholder="Логін"
            value={loginData.login}
            onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <button type="submit">Увійти</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="container">
        <div className="top_panel">
          <h1 className="panel_title">Панель керування сайтом</h1>
          {!soundEnabled ? (
            <button className="on" onClick={enableSound}>
              Увімкнути сповіщення <img src={SoundOn} alt="#" />
            </button>
          ) : (
            <div className="notification-status">
              <button className="off" onClick={disableSound}>
                Вимкнути сповіщення <img src={SoundOff} alt="#" />
              </button>
            </div>
          )}
          <Clock />
          <button className="off_btn" onClick={handleLogout}>
            Вихід <img src={ExitIcon} alt="Вихід" />
          </button>
        </div>
        <TabBlockPanel soundEnabled={soundEnabled} notificationSound={notificationSound} />
      </div>
    </div>
  );
}

export default PanelPage;