import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './cabinet.css'
const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const MainInfoTab = () => {
  const [userInfo, setUserInfo] = useState({
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

  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Не вдалося завантажити дані користувача', error);
        setNotification('Не вдалося завантажити дані користувача');
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
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
      <div className="form__container">
        <div className="title_descr-cabinet">
          <h3>Особиста інформація</h3>
          <p>Вкажіть ваші персональні дані, щоб при оформленні замовлення не заповнювати вручну.</p>
        </div>
        <div className='form_group'>
          <label>
            <p>Ім'я *</p>
            <input
              type='text'
              name='firstName'
              value={userInfo.firstName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <p>Прізвище *</p>
            <input
              type='text'
              name='lastName'
              value={userInfo.lastName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <p>Телефон *</p>
            <input
              type='text'
              name='phone'
              value={userInfo.phone}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <p>Електронна пошта</p>
            <input
              type='email'
              name='email'
              value={userInfo.email}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div className="title_descr-cabinet">
          <h3>Доставка</h3>
          <p>Вкажіть дані для відправки ваших замовлень.</p>
        </div>
        <div className='form_group-delivery'>
          <div className="delivery_item-input">
            <label>
              <p>Місто *</p>
              <input
                type='text'
                name='city'
                value={userInfo.city}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <p>Адреса відділення *</p>
              <input
                type='text'
                name='deliveryAddress'
                value={userInfo.deliveryAddress}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <p>Номер відділення *</p>
              <input
                type='text'
                name='departmentNumber'
                value={userInfo.departmentNumber}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="title_descr-cabinet">
            <h3>Оплата</h3>
            <p>Вкажіть дані для відправки ваших замовлень.</p>
          </div>
          <div className="pay_deliver-item">
            <label>
              <p>Спосіб оплати:</p>
              <select
                name='paymentMethod'
                value={userInfo.paymentMethod}
                onChange={handleInputChange}
              >
                <option value=''>Оберіть спосіб оплати</option>
                <option value='Оплата при отриманні'>Оплата при отриманні</option>
                <option value='Банківський переказ'>Банківський переказ</option>
                <option value='Оплата за реквізитами'>Оплата за реквізитами</option>
              </select>
            </label>
            <label>
              <p>Спосіб доставки:</p>
              <select
                name='deliveryMethod'
                value={userInfo.deliveryMethod}
                onChange={handleInputChange}
              >
                <option value=''>Оберіть спосіб доставки</option>
                <option value='Нова пошта відділення'>Нова пошта відділення</option>
                <option value='Нова пошта поштомат'>Нова пошта поштомат</option>
                <option value='Нова пошта курєром'>Нова пошта кур'єром</option>
                <option value='Укрпошта'>Укрпошта</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <button className='save__btn' type='submit'>Зберегти зміни</button>

      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}
    </form>
  );
};

export default MainInfoTab;