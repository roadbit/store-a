import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './nav.css';


import Sidebar from '../Components/Sidebar'
import SearchPanel from '../Components/Search';
import SearchPanelMobile from '../Components/SearchMobile';
import PersonIcon from '../Assets/icon-nav/person.svg';
import BagIcon from '../Assets/icon-nav/bag.svg';
import BagModal from '../Components/Bag';
import SearchIconBtn from '../Assets/icon-nav/search-icon-btn.svg';
import { useCart } from '../CartContext';

function NavPanel() {
  const { cartItems, isCartOpen, closeCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/cabinet');
    } else {
      navigate('/login');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isCartOpen) {
      setIsModalOpen(true);
    }
  }, [isCartOpen]);

  const hasItemsInCart = cartItems.length > 0;

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <div className='header'>
      <div className="header_top">
        <div className="header_top_container">
          <div className="logo_catlog-item">
            <Sidebar />
            <Link className="logo-link" to='/'>UPTONNN</Link>
            <Link className="catalog-link-m" to='/catalog'>Каталог</Link>
          </div>
          <Link className="catalog-link" to='/catalog'>Каталог</Link>
          <div className="search_top">
            <SearchPanel />
          </div>
          <div className="bag_cabinet-item">
            <button className="search_btn-m" onClick={toggleMobileSearch}>
              <img src={SearchIconBtn} alt="Пошук" />
            </button>
            <button className='cabinet_btn' onClick={handleLoginClick}>
              <img src={PersonIcon} alt="Login Icon" />
            </button>
            <button className="bag_btn" onClick={openModal}>
              <img src={BagIcon} alt="Кошик" />
              {hasItemsInCart && (
                <span className="cart_indicator-dot"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <BagModal onClose={() => { setIsModalOpen(false); closeCart(); }} />}

      {isMobileSearchOpen && (
        <SearchPanelMobile onClose={toggleMobileSearch} />
      )}
    </div>
  );
}

export default NavPanel;