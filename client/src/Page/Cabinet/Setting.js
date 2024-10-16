import React, { useState } from 'react';
import axios from 'axios';
import './cabinet.css'
const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const MainInfoTab = () => {
  const [userInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    deliveryMethod: '',
    deliveryAddress: '',
    deliveryIndex: '',
    paymentMethod: '',
    departmentNumber: ''
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [notification, setNotification] = useState('');


  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setNotification('Новий пароль і підтвердження пароля не співпадають');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${baseURL}/api/user/change-password`, 
      {
        currentPassword, 
        newPassword 
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotification('Пароль успішно оновлено');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Не вдалося оновити пароль', error);
      setNotification('Не вдалося оновити пароль');
    }

    setTimeout(() => setNotification(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${baseURL}/api/user/update`, userInfo, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotification('Дані оновлені');
    } catch (error) {
      console.error('Не вдалося оновити дані', error);
      setNotification('Не вдалося оновити дані');
    }
  
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <form className='cabinet_form-container' onSubmit={handleSubmit}>
      <div className="title_descr-cabinet">
        <h3>Зміна пароля</h3>
      </div>
      <div className='form_group-pass'>
        <label>
          <p>Поточний пароль:</p>
          <input
            type='password'
            name='currentPassword'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label>
          <p>Новий пароль:</p>
          <input
            type='password'
            name='newPassword'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label>
          <p>Підтвердити пароль:</p>
          <input
            type='password'
            name='confirmNewPassword'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </label>
      </div>
      <button className='save__btn-pass' onClick={handlePasswordChange}>Оновити пароль</button>

      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}
    </form>
  );
};

export default MainInfoTab;