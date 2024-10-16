import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './nav.css';
import MenuIcon from '../Assets/icon-nav/menu-icon.svg'
import CloseIcon from '../Assets/chat-icon/close-icon.svg'
import CatalogIcon from '../Assets/icon-nav/catalog-menu-icon.svg'
import PersonIcon from '../Assets/icon-nav/person.svg';
import InfoIcon from '../Assets/icon-nav/info-icon.svg';
import ContactIcon from '../Assets/icon-nav/contact-icon.svg';

import sIcon1 from '../Assets/s-icon/f.svg'
import sIcon2 from '../Assets/s-icon/i.svg'
import sIcon3 from '../Assets/s-icon/t.svg'
import sIcon4 from '../Assets/s-icon/tt.svg'
import sIcon5 from '../Assets/s-icon/p.svg'

import CartSummary from '../Components/CartSummary';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [links, setLinks] = useState({
    facebook: '',
    instagram: '',
    telegram: '',
    tiktok: '',
    viber: '',
    phone1: '',
    phone2: ''
  });

  useEffect(() => {
    axios.get(`${baseURL}/api/footerLinks`)
      .then(response => {
        if (response.data) {
          setLinks(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching footer links:', error);
      });
  }, []);

  const handleLoginClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/cabinet');
    } else {
      navigate('/login');
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleSidebar} className="open-sidebar-btn">
        <img src={MenuIcon} alt="Меню" />
      </button>

      <div className={`side_bar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
            <div className="menu_logo-title">
                <p className="menu_logo">UPTONNN</p>
                <button className="close-btn" onClick={toggleSidebar}><img src={CloseIcon} alt="Закрити" /></button>
            </div>
            <div className="menu_link-item">
                <div className="link_item">
                    <button className="catalog-link-btn"><Link to='/catalog'><img src={CatalogIcon} alt='Каталог' />Каталог</Link></button>
                    <button className='cabinet_btn-m' onClick={handleLoginClick}>
                        <img src={PersonIcon} alt="Login Icon" />
                        <p>Кабінет</p>
                    </button>
                    <CartSummary />
                    <div className="info_item">
                        <p className="info_title"><img src={InfoIcon} alt="Допомога" />Допомога</p>
                        <Link className='col__descr' to="/povernenya-tovary">Повернення товарів</Link>
                        <Link className='col__descr' to="/polityka-konfidentsiynosti">Політика конфіденційності</Link>
                        <Link className='col__descr' to="/umovy-vykorustanay-saytu">Умови використання</Link>
                        <p className="contact_title"><img src={ContactIcon} alt="Контакти" />Контакти</p>
                        <div className="footer__col">
                            {links.facebook && (
                            <Link className='soc__link' to={links.facebook} target="blank">
                                <img src={sIcon1} alt="Facebook" />Facebook
                            </Link>
                            )}
                            {links.instagram && (
                            <Link className='soc__link' to={links.instagram} target="blank">
                                <img src={sIcon2} alt="Instagram" />Instagram
                            </Link>
                            )}
                            {links.telegram && (
                            <Link className='soc__link' to={links.telegram} target="blank">
                                <img src={sIcon3} alt="Telegram" />Telegram
                            </Link>
                            )}
                            {links.tiktok && (
                            <Link className='soc__link' to={links.tiktok} target="blank">
                                <img src={sIcon4} alt="TikTok" />TikTok
                            </Link>
                            )}
                            <div className="footer_item-tel">
                            {links.phone1 && (
                                <Link className='tel__link-footer' to={`tel:${links.phone1}`}>
                                <img src={sIcon5} alt="Phone" />
                                {links.phone1}
                                </Link>
                            )}
                            {links.phone2 && (
                                <Link className='tel__link-footer' to={`tel:${links.phone2}`}>
                                <img src={sIcon5} alt="Phone" />
                                {links.phone2}
                                </Link>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;