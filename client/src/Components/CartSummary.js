import React from 'react';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import './card-sum.css'

const formatNumber = (number) => {
  return number.toLocaleString('uk-UA');
};

function CartSummary() {
  const { cartItems, openCart } = useCart();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (total, item) => total + parseInt((item.price || '').toString().replace(/\D/g, '')) * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return null;
  }

  const handleOpenCart = () => {
    openCart();
  };

  const handleOrderClick = () => {
    navigate('/oformlennya-zamovlennya');
  };

  return (
    <div className="cart-summary">
      <p>У кошику {totalItems} {totalItems === 1 ? 'замовлення' : 'замовлень'} <br /> на суму {formatNumber(totalPrice)} грн.</p>
      <div className="cart-summary-buttons">
        <button className='open_bag' onClick={handleOpenCart}>До кошика</button>
        <button className='open_order' onClick={handleOrderClick}>Купити зараз</button>
      </div>
    </div>
  );
}

export default CartSummary;