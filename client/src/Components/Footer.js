import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './f.css'

import sIcon1 from '../Assets/s-icon/f.svg'
import sIcon2 from '../Assets/s-icon/i.svg'
import sIcon3 from '../Assets/s-icon/t.svg'
import sIcon4 from '../Assets/s-icon/tt.svg'
import sIcon5 from '../Assets/s-icon/p.svg'

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const Footer = () => {
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

  return (
    <div className="footer_container">
      <div className="footer__col">
        <Link className="logo-link-f" to='/'>UPTONNN</Link>
      </div>
      <div className="footer__col">
        <p className='col__title'>Інформація</p>
        <Link className='col__descr' to="/povernenya-tovary">Повернення товарів</Link>
        <Link className='col__descr' to="/polityka-konfidentsiynosti">Політика конфіденційності</Link>
        <Link className='col__descr' to="/umovy-vykorustanay-saytu">Умови використання</Link>
      </div>
      <div className="footer__col">
        <p className='col__title'>Оплата</p>
        <p className='col__descr'>Оплата при отриманні</p>
        <p className='col__descr'>Безготівковий розрахунок</p>
        <p className='col__descr'>Банківський переказ</p>
        <p className='col__descr-last'>На розрахунковий рахунок</p>
      </div>
      <div className="footer__col">
        <p className='col__title'>Контакти</p>
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
  );
};

export default Footer;