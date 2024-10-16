import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const FooterLinks = () => {
  const [links, setLinks] = useState({
    facebook: '',
    instagram: '',
    telegram: '',
    tiktok: '',
    phone1: '',
    phone2: ''
  });

  const [notification, setNotification] = useState('');

  useEffect(() => {
    axios.get(`${baseURL}/api/footerLinks`)
      .then(response => {
        if (response.data) {
          setLinks(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching footer links:', error);
        showNotification('Помилка при завантаженні');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks(prevLinks => ({
      ...prevLinks,
      [name]: value
    }));
  };

  const handleSave = () => {
    axios.post(`${baseURL}/api/footerLinks`, links)
      .then(response => {
        showNotification('Збережено успішно');
      })
      .catch(error => {
        console.error('Error saving links:', error);
        showNotification('Помилка при збереженні');
      });
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  return (
    <div className='soc_item-footer'>
      <div>
        <label>Facebook</label>
        <input type="text" name="facebook" value={links.facebook} onChange={handleChange} />
      </div>
      <div>
        <label>Instagram</label>
        <input type="text" name="instagram" value={links.instagram} onChange={handleChange} />
      </div>
      <div>
        <label>Telegram</label>
        <input type="text" name="telegram" value={links.telegram} onChange={handleChange} />
      </div>
      <div>
        <label>TikTok</label>
        <input type="text" name="tiktok" value={links.tiktok} onChange={handleChange} />
      </div>
      <h3>Додати телефони</h3>
      <div>
        <label>Телефон 1</label>
        <input type="text" name="phone1" value={links.phone1} onChange={handleChange} />
      </div>
      <div>
        <label>Телефон 2</label>
        <input type="text" name="phone2" value={links.phone2} onChange={handleChange} />
      </div>
      <button onClick={handleSave}>Додати\Оновити</button>

      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}
    </div>
  );
};

export default FooterLinks;