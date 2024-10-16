import React, { useState, useEffect } from 'react';
import NavPanel from '../Components/Nav';
import Footer from '../Components/Footer'
import { useCart } from '../CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import DeleteIcon from '../Assets/icon-nav/delete-icon.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const formatNumber = (number) => {
  return number.toLocaleString('uk-UA');
};

function OrderPage() {
  const { cartItems, updateCartItems } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    city: '',
    address: '',
    comment: '',
    deliveryMethod: 'Нова Пошта (відділення)',
    paymentMethod: 'Післяплата',
    district: '',
    street: '',
    houseNumber: '',
    departmentNumber: ''
  });
  
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

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
        setFormData(prevData => ({
          ...prevData,
          name: response.data.firstName,
          surname: response.data.lastName,
          phone: response.data.phone,
          city: response.data.city,
          address: response.data.deliveryAddress,
          deliveryMethod: response.data.deliveryMethod,
          paymentMethod: response.data.paymentMethod,
          departmentNumber: response.data.departmentNumber
        }));
      } catch (error) {
        console.error('Не вдалося завантажити дані користувача', error);
      }
    };
  
    fetchUserInfo();
  }, []);

  const generateOrderNumber = () => {
    const getRandomSegment = () => Math.floor(1000 + Math.random() * 9000);
    return `${getRandomSegment()}-${getRandomSegment()}-${getRandomSegment()}-${getRandomSegment()}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderNumber = generateOrderNumber();
    const orderDetails = {
      ...formData,
      cartItems,
      orderNumber,
    };
    sendOrderToTelegram(orderDetails);
    clearFormAndCart();
    navigate('/zamovlennya_oformlene_uspishno', { state: { orderDetails } });
  };

  const sendOrderToTelegram = (orderDetails) => {
    const TOKEN = "6383541177:AAGEsa4B5Bsu_eeWuptQGy1cRGvjm28kwYY";
    const CHAT_ID = "-1002049716001";
    const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    let message = `<b>Замовлення №${orderDetails.orderNumber}</b>\n`;
    message += `<b>Ім'я:</b> ${orderDetails.name}\n`;
    message += `<b>Прізвище:</b> ${orderDetails.surname}\n`;
    message += `<b>Телефон:</b> ${orderDetails.phone}\n`;
    message += `<b>Місто:</b> ${orderDetails.city}\n`;
    if (orderDetails.deliveryMethod === 'Адресна доставка') {
      message += `<b>Район:</b> ${orderDetails.district}\n`;
      message += `<b>Вулиця:</b> ${orderDetails.street}\n`;
      message += `<b>Номер будинку:</b> ${orderDetails.houseNumber}\n`;
    } else {
      message += `<b>Адреса відділення / індекс:</b> ${orderDetails.address}\n`;
    }
    message += `<b>Коментар:</b> ${orderDetails.comment}\n`;
    message += `<b>Метод доставки:</b> ${orderDetails.deliveryMethod}\n`;
    message += `<b>Метод оплати:</b> ${orderDetails.paymentMethod}\n`;
    message += `<b>Товари:</b>\n`;
    orderDetails.cartItems.forEach(item => {
      message += `- ${item.title} (${item.quantity}) - ${item.price} грн\n`;
    });

    axios.post(URI_API, {
      chat_id: CHAT_ID,
      parse_mode: 'html',
      text: message,
    })
    .then(response => {
    })
    .catch(error => {
      console.error('Помилка надсилання', error);
    });
  };

  const clearFormAndCart = () => {
    setFormData({
      name: '',
      surname: '',
      phone: '',
      city: '',
      address: '',
      comment: '',
      deliveryMethod: 'Нова Пошта (відділення)',
      paymentMethod: 'Післяплата',
      district: '',
      street: '',
      houseNumber: ''
    });
    updateCartItems([]);
  };

  const handleQuantityChange = (id, change) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCartItems(newCartItems);
  };

  const handleRemoveItem = (id) => {
    const newCartItems = cartItems.filter((item) => item.id !== id);
    updateCartItems(newCartItems);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + parseInt((item.price || '').toString().replace(/\D/g, '')) * item.quantity,
      0
    );
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className='main-container'>
      <NavPanel />
      <div className="container">
        <form className='order_form' onSubmit={handleSubmit}>
          <h2>Оформлення замовлення</h2>

          <div className="card_form-grid">
            <div className="form_user-delivery">
              <p className='user_data'>Віші дані</p>
              <div className="user_name-phone">
                <label>
                  <p>Ім'я *</p>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <label>
                  <p>Прізвище *</p>
                  <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />
                </label>
                <label>
                  <p>Телефон *</p>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </label>
              </div>
              <div className="delivery_method">
                <label>
                  <p>Спосіб доставки *</p>
                  <select name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange} required>
                    <option value="Нова Пошта (відділення)">Нова Пошта (відділення)</option>
                    <option value="Нова Пошта (поштомат)">Нова Пошта (поштомат)</option>
                    <option value="Адресна доставка">Адресна доставка</option>
                    <option value="Укрпошта">Укрпошта</option>
                  </select>
                </label>
              </div>
              <p className='address_title'>Адреса доставки</p>
              <div className="address_delivery">
                <label>
                  <p>Місто доставки *</p>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                </label>
                {(formData.deliveryMethod === 'Нова Пошта (відділення)' || formData.deliveryMethod === 'Укрпошта') && (
                  <label>
                    <p>Адреса відділення *</p>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                  </label>
                )}
                {formData.deliveryMethod !== 'Адресна доставка' && formData.deliveryMethod !== 'Нова Пошта (поштомат)' && (
                  <label>
                    <p>№ Відділення / індекс *</p>
                    <input type="text" name="departmentNumber" value={formData.departmentNumber} onChange={handleChange} />
                  </label>
                )}
                {formData.deliveryMethod === 'Нова Пошта (поштомат)' && (
                  <label>
                    <p>Номер поштомату *</p>
                    <input type="text" name="departmentNumber" value={formData.departmentNumber} onChange={handleChange} />
                  </label>
                )}
                {formData.deliveryMethod === 'Адресна доставка' && (
                  <>
                    <label>
                      <p>Район *</p>
                      <input type="text" name="district" value={formData.district} onChange={handleChange} />
                    </label>
                    <label>
                      <p>Вулиця *</p>
                      <input type="text" name="street" value={formData.street} onChange={handleChange} />
                    </label>
                    <label>
                      <p>Номер будинку *</p>
                      <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleChange} />
                    </label>
                  </>
                )}
              </div>
              
              <fieldset>
                <div className="pay_user">
                  <p className='pay_user-title'>Метод оплати</p>
                  <label>
                    <input type="radio" name="paymentMethod" value="Оплата при отриманні" checked={formData.paymentMethod === 'Оплата при отриманні'} onChange={handleChange} />
                    <p>Оплата при отриманні</p>
                  </label>
                  <label>
                    <input type="radio" name="paymentMethod" value="Банківський переказ" checked={formData.paymentMethod === 'Банківський переказ'} onChange={handleChange} />
                    <p>Банківський переказ</p>
                  </label>
                  <label>
                    <input type="radio" name="paymentMethod" value="Розрахунковий рахунок" checked={formData.paymentMethod === 'Розрахунковий рахунок'} onChange={handleChange} />
                    <p>Оплата за реквізитами</p>
                  </label>
                </div>
              </fieldset>
            </div>
            
            <div className="cart_order-container">
              <div className="cart_items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart_item">
                    <div className="item_details">
                      <img src={`${baseURL}/${item.image}`} alt={item.title} className="item_image" />
                      <div className="title-price_count">
                        <p className="item_title">{item.title}</p>
                        <div className="count_price-item">
                          <div className="item_quantity">
                            <button className='minus_btn' type="button" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button className='plus_btn' type="button" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                          </div>
                          <p className="item_price">
                            {formatNumber(parseInt((item.price || '').toString().replace(/\D/g, '')) * item.quantity)} грн
                          </p>
                        </div>
                      </div>
                      <button type="button" onClick={() => handleRemoveItem(item.id)} className="delete_card-prod"><img src={DeleteIcon} alt="DeleteIcon" /></button>
                    </div>
                  </div>
                ))}
                <div className="price_btn-item">
                  <div className="total_price">
                    <p>Загальна сума: {formatNumber(totalPrice)} грн</p>
                  </div>
                  <button type="submit">Підтвердити замовлення</button>
                </div>
              </div>
            </div>
          </div>

        </form>
        <Footer />
      </div>
    </div>
  );
}

export default OrderPage;