import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import '../Page/page.css';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function OrderConfirmation() {
  const { state } = useLocation();
  const { orderDetails } = state;

  const formatNumber = (number) => {
    return number.toLocaleString('uk-UA');
  };

  const calculateTotalPrice = () => {
    return orderDetails.cartItems.reduce(
      (total, item) => total + parseInt((item.price || '').toString().replace(/\D/g, '')) * item.quantity,
      0
    );
  };

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
  
    const newOrders = orderDetails.cartItems.map((item, index) => ({
      orderNumber: `${orderDetails.orderNumber}-${index + 1}`,
      item: item,
      cartItems: orderDetails.cartItems,
      date: new Date().toLocaleString('uk-UA'),
      total: parseInt((item.price || '').toString().replace(/\D/g, '')) * item.quantity,
      name: orderDetails.name,
      surname: orderDetails.surname,
      phone: orderDetails.phone,
      city: orderDetails.city,
      address: orderDetails.deliveryMethod !== 'Адресна доставка' ? orderDetails.address : null,
      district: orderDetails.deliveryMethod === 'Адресна доставка' ? orderDetails.district : null,
      street: orderDetails.deliveryMethod === 'Адресна доставка' ? orderDetails.street : null,
      houseNumber: orderDetails.deliveryMethod === 'Адресна доставка' ? orderDetails.houseNumber : null,
      deliveryMethod: orderDetails.deliveryMethod,
      paymentMethod: orderDetails.paymentMethod,
    }));
  
    localStorage.setItem('orders', JSON.stringify([...storedOrders, ...newOrders]));
  }, [orderDetails]);

  return (
      <div className='main-container'>
        <Nav />
        <div className="container">
          <div className="order_number-container">
            <h2>Дані про замовлення</h2>
            <p className='number_order'><strong>Номер замовлення:</strong> {orderDetails.orderNumber}</p>

            <h3 className='user_order-list'>Ваше замовлення:</h3>
            <ul>
              {orderDetails.cartItems.map((item) => (
                <li key={item.id}>
                  <img src={`${baseURL}/${item.image}`} alt={item.title} className="item-image" />
                  <div className="price_count-product__li">
                    <p className='title_product-li'>{item.title}</p>
                    <p>Кількість: {item.quantity}</p>
                    <p className='price_card-li'>Ціна: {formatNumber(parseInt((item.price || '').toString().replace(/\D/g, '')))} грн</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className='all_summ'><strong>Загальна сума:</strong> {formatNumber(calculateTotalPrice())} грн</p>

            <h3 className='order_user-data'>Ваші дані:</h3>
            <div className="user_info-item">
              <p><strong>Ім'я - </strong> {orderDetails.name}</p>
              <p><strong>Прізвище - </strong> {orderDetails.surname}</p>
              <p><strong>Телефон - </strong> {orderDetails.phone}</p>
              <p><strong>Місто доставки - </strong> {orderDetails.city}</p>
              {orderDetails.deliveryMethod !== 'Адресна доставка' ? (
                <p><strong>Адреса відділення / індекс - </strong> {orderDetails.address}</p>
              ) : null}
              {orderDetails.deliveryMethod === 'Адресна доставка' && (
                <>
                  <p><strong>Район - </strong> {orderDetails.district}</p>
                  <p><strong>Вулиця - </strong> {orderDetails.street}</p>
                  <p><strong>Номер будинку - </strong> {orderDetails.houseNumber}</p>
                </>
              )}
              <p><strong>Метод доставки - </strong> {orderDetails.deliveryMethod}</p>
              <p><strong>Метод оплати - </strong> {orderDetails.paymentMethod}</p>
            </div>
            <p className='th_user'>Дякуємо за ваше замовлення!</p>
            <Link className='ret_home' to='/'>Повернутись на головну</Link>
          </div>
          <Footer />
        </div>
      </div>
  );
}

export default OrderConfirmation;