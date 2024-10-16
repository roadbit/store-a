import React, { useEffect, useState } from 'react';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const OrderReceived = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('receivedOrders')) || [];
    setOrders(storedOrders);
  }, []);

  const handleCheckboxChange = (orderNumber) => {
    setSelectedOrders((prevSelected) => {
      if (prevSelected.includes(orderNumber)) {
        return prevSelected.filter((num) => num !== orderNumber);
      } else {
        return [...prevSelected, orderNumber];
      }
    });
  };

  const handleDelete = () => {
    const updatedOrders = orders.filter(order => !selectedOrders.includes(order.orderNumber));
    setOrders(updatedOrders);
    localStorage.setItem('receivedOrders', JSON.stringify(updatedOrders));
    setSelectedOrders([]);
  };

  return (
    <div className='order_list-panel'>
      <h3 className='list_title'>Отримані</h3>
      <div className="button_list-line">
        <button onClick={handleDelete} disabled={selectedOrders.length === 0}>
          Видалити відмічені
        </button>
      </div>
      <ul className='order_list-container'>
        {orders.map((order, index) => (
          <li className='order_list-li' key={index}>
            <input 
              type="checkbox" 
              checked={selectedOrders.includes(order.orderNumber)}
              onChange={() => handleCheckboxChange(order.orderNumber)} 
            />
            <div className="descr_order-list">
              <h4>Замовлення №{order.orderNumber}:</h4>
              <div className="descr_person-list">
                <p>Ім'я: {order.name}</p>
                <p>Прізвище: {order.surname}</p>
                <p>Телефон: {order.phone}</p>
                <p>Спосіб доставки: {order.deliveryMethod}</p>
                {order.deliveryMethod !== 'Адресна доставка' ? (
                  <>
                    <p>Адреса відділення: {order.address}</p>
                  </>
                ) : (
                  <>
                    <p>Район: {order.district}</p>
                    <p>Вулиця: {order.street}</p>
                    <p>Номер будинку: {order.houseNumber}</p>
                  </>
                )}
                <p>Спосіб оплати: {order.paymentMethod}</p>
                <p>Загальна сума: {order.total} грн</p>
              </div>
              
            </div>
            
            <ul className='new_order-item'>
              {order.cartItems && Array.isArray(order.cartItems) ? (
                order.cartItems.map((item) => (
                  <li key={item.id}>
                    <img src={`${baseURL}/${item.image}`} alt={item.title} className="item_image" />
                    <div className="descr_order-li_list">
                      <p>{item.title}</p>
                      <p>(Кількість: {item.quantity})</p>
                      <p>{item.price} грн</p>
                    </div>
                  </li>
                ))
              ) : (
                <li>Товари відсутні в цьому замовленні</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderReceived;