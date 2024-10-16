import React, { useEffect, useState } from 'react';
import { useCart } from '../CartContext';
import DeleteIcon from '../Assets/icon-nav/delete-icon.svg';
import { useNavigate } from 'react-router-dom';
import './nav.css'

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const formatNumber = (number) => {
  return number.toLocaleString('uk-UA');
};

function BagModal({ onClose }) {
  const { cartItems, removeFromCart, updateCartItems } = useCart();
  const [localCartItems, setLocalCartItems] = useState(cartItems);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalCartItems(cartItems);
  }, [cartItems]);

  const handleQuantityChange = (id, change) => {
    const newCartItems = localCartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setLocalCartItems(newCartItems);
    updateCartItems(newCartItems);
  };

  const calculateTotalPrice = () => {
    return localCartItems.reduce(
      (total, item) => total + parseInt((item.price || '').toString().replace(/\D/g, '')) * item.quantity,
      0
    );
  };

  const totalPrice = calculateTotalPrice();

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal_overlay') {
      onClose();
    }
  };

  const handleOrderClick = () => {
    navigate('/oformlennya-zamovlennya');
    onClose();
  };

  return (
    <div className='modal_overlay' onClick={handleOutsideClick}>
      <div className='modal_container'>
        <div className='modal_header'>
          <h2>Кошик</h2>
          <button className='close_btn' onClick={onClose}>✖</button>
        </div>
        <div className='modal_content'>
          {localCartItems.map((item) => (
            <div key={item.id} className="bag_card">
              <div className="bag_card-prod">
                <div className="title-image_btn-item">
                  <img className='prod_card-img' src={`${baseURL}/${item.image}`} alt="img" />
                  <p className="bag__title-prod">{item.title}</p>
                  <button className="delete_card-prod" onClick={() => removeFromCart(item.id)}>
                    <img className='delete_image' src={DeleteIcon} alt="img" />
                  </button>
                </div>
                <div className="card_title-delete">
                  <div className="count_bag-item">
                    <div className="count_btn">
                      <button className="minus_btn" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button className="plus_btn" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                    </div>
                    <p className="bag_card-price">
                      {formatNumber(parseInt((item.price || '').toString().replace(/\D/g, '')) * item.quantity)} грн
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='modal_footer'>
          <div className="total_count-price">
            <p className="total_price">Загальна сума:</p>
            <span>{formatNumber(totalPrice)} грн</span>
          </div>
          {localCartItems.length > 0 && (
            <button className="config_order" onClick={handleOrderClick}>Оформити замовлення</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BagModal;