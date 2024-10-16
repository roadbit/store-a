import React, { useState, useEffect } from 'react';
import DeleteIcon from '../../Assets/icon-nav/delete-icon.svg'
import './cabinet.css'
const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const parsedOrders = storedOrders.map((order, index) => ({
      ...order,
      date: parseDateString(order.date),
      id: `order-${index}-${order.orderNumber}`
    }));

    setOrders(parsedOrders);
    setFilteredOrders(parsedOrders);
  }, []);

  const parseDateString = (dateString) => {
    const [datePart, timePart] = dateString.split(', ');
    const [day, month, year] = datePart.split('.');
    return new Date(`${year}-${month}-${day}T${timePart}`);
  };

  const filterOrders = (period) => {
    const now = new Date();
    let filtered = orders;

    switch (period) {
      case 'thisMonth':
        filtered = orders.filter(order => order.date.getMonth() === now.getMonth() && order.date.getFullYear() === now.getFullYear());
        break;
      case 'lastMonth':
        filtered = orders.filter(order => {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          return order.date.getMonth() === lastMonth.getMonth() && order.date.getFullYear() === lastMonth.getFullYear();
        });
        break;
      case 'thisYear':
        filtered = orders.filter(order => order.date.getFullYear() === now.getFullYear());
        break;
      case 'lastYear':
        filtered = orders.filter(order => order.date.getFullYear() === now.getFullYear() - 1);
        break;
      default:
        filtered = orders;
    }

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    filterOrders(event.target.value);
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prevSelectedOrders =>
      prevSelectedOrders.includes(orderId)
        ? prevSelectedOrders.filter(id => id !== orderId)
        : [...prevSelectedOrders, orderId]
    );
  };

  const handleSelectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const isOrderSelected = (orderId) => selectedOrders.includes(orderId);

  const handleDeleteSelectedOrders = () => {
    const updatedOrders = orders.filter(order => !selectedOrders.includes(order.id));
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    setSelectedOrders([]);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  return (
    <div className='order__content-container_tab'>
      <h1>Ваші замовлення</h1>
      <div className="select_btn-item">
        <label className='filter-label'>
          <p>Фільтр:</p>
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">Всі замовлення</option>
            <option value="thisMonth">Цього місяця</option>
            <option value="lastMonth">Минулий місяць</option>
            <option value="thisYear">Цього року</option>
            <option value="lastYear">Минулий рік</option>
          </select>
        </label>
        <div className="button_check-item">
          {filteredOrders.length > 0 && (
            <button onClick={handleSelectAllOrders}>
              {selectedOrders.length === filteredOrders.length ? "Відмінити" : "Обрати всі"}
            </button>
          )}
          {selectedOrders.length > 0 && (
            <button className='delete_btn' onClick={handleDeleteSelectedOrders}>Видалити</button>
          )}
          {selectedOrders.length > 0 && (
            <button className='delete_btn-order' onClick={handleDeleteSelectedOrders}>
              <img src={DeleteIcon} alt="Видалити" />
            </button>
          )}
        </div>
      </div>
      <ul className='order_item-grid'>
        {filteredOrders.map((order) => (
          <li className='order_card-tab' key={order.id}>
            <input className='check_card-input'
              type="checkbox"
              checked={isOrderSelected(order.id)}
              onChange={() => handleSelectOrder(order.id)}
            />
            <span><b>Дата:</b><br />{order.date.toLocaleString()}</span>

            {order.item && (
              <div className='order_card-tab__inner'>
                {order.item.image ? (
                  <img src={`${baseURL}/${order.item.image}`} alt={order.item.title || "Назва відсутня"} />
                ) : (
                  <p>Зображення відсутнє</p>
                )}
                <p className='order-card_title'>{order.item.title || order.item.name || "Назва відсутня"}</p>
                <p className='order-count_title'>Кількість: {order.item.quantity}</p>
                <p className='order-price_title'>Ціна: {order.total} грн</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;