import React, { useState } from 'react';
import axios from 'axios';
import Nav from '../Components/Nav'
import Footer from '../Components/Footer'
import PassIcon from '../Assets/login-icon/eye-on.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    firstName: '', lastName: '', phone: '', email: '', password: '', confirmPassword: ''
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value || '' });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value || '' });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/api/auth/login`, loginData);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/cabinet';
    } catch (err) {
      console.error(err);
      alert('Невірні облікові дані');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      if (registerData.password !== registerData.confirmPassword) {
        alert('Паролі не співпадають');
        return;
      }

      await axios.post(`${baseURL}/api/auth/register`, registerData);
      setRegistrationSuccess(true);
      setIsRegister(false);
      setLoginData({ email: registerData.email, password: registerData.password });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-container">
      <Nav />
      <div className="container">
        <div className="login_container">
          {registrationSuccess && (
            <div className="success-message">
              Реєстрація успішна! Тепер ви можете увійти.
            </div>
          )}
          {!isRegister ? (
            <div className="login-item">
              <h2>Авторизація</h2>
              <form onSubmit={handleLoginSubmit}>
                <input
                  className='log_input'
                  type="email"
                  name="email"
                  placeholder="Ваш Email"
                  value={loginData.email || ''}
                  onChange={handleLoginChange}
                  required
                />
                <div className="input__btn-pass">
                  <input
                    className='pass_input'
                    type={showLoginPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Ваш пароль"
                    value={loginData.password || ''}
                    onChange={handleLoginChange}
                    required
                  />
                  <button
                    className="btn_pass"
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    <img src={PassIcon} alt="Toggle Password Visibility" />
                  </button>
                </div>
                <button className='btn__enter' type="submit">Увійти</button>
                <div className="button_title-item">
                  <p>Відсутній акаунт?</p>
                  <button className='log__enter' type="button" onClick={() => setIsRegister(true)}>Зареєструватись</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="register-item">
              <h2>Реєстрація</h2>
              <form onSubmit={handleRegisterSubmit}>
                <input
                  className='reg_name'
                  type="text"
                  name="firstName"
                  placeholder="Ім'я"
                  value={registerData.firstName || ''}
                  onChange={handleRegisterChange}
                  required
                />
                <input
                  className='reg_name'
                  type="text"
                  name="lastName"
                  placeholder="Прізвище"
                  value={registerData.lastName || ''}
                  onChange={handleRegisterChange}
                  required
                />
                <input
                  className='reg_phone'
                  type="text"
                  name="phone"
                  placeholder="Телефон"
                  value={registerData.phone || ''}
                  onChange={handleRegisterChange}
                  required
                />
                <input
                  className='reg_mail'
                  type="email"
                  name="email"
                  placeholder="Пошта"
                  value={registerData.email || ''}
                  onChange={handleRegisterChange}
                  required
                />
                <div className="input__btn-pass">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Пароль"
                    value={registerData.password || ''}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="input__btn-pass">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Повторіть пароль"
                    value={registerData.confirmPassword || ''}
                    onChange={handleRegisterChange}
                    required
                  />
                  <button
                    className="btn_pass"
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    <img src={PassIcon} alt="Toggle Password Visibility" />
                  </button>
                </div>
                <div className='label__log'>
                  <input type="checkbox" required />
                  <p>Приймаю умови на обробку персональних данних</p>
                </div>
                <button className='btn__enter' type="submit">Зареєструватись</button>
                <button className='log__enter' type="button" onClick={() => setIsRegister(false)}>Вже зареєстрований</button>
              </form>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Login;