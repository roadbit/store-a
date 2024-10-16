import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const CreateTopSlider = () => {
  const [productPage, setProductPage] = useState('');
  const [pages, setPages] = useState([]);
  const [productData, setProductData] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    axios.get(`${baseURL}/api/productpages`)
      .then(response => setPages(response.data))
      .catch(error => console.error('Помилка при завантаженні сторінок:', error));
  }, []);

  const handleSelectChange = (e) => {
    const selectedPageId = e.target.value;
    setProductPage(selectedPageId);

    if (selectedPageId) {
      axios.get(`${baseURL}/api/productpages/${selectedPageId}`)
        .then(response => setProductData(response.data))
        .catch(error => console.error('Помилка при завантаженні продукту:', error));
    } else {
      setProductData(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productData) return;

    const formData = {
      productPage,
      image: productData.images[0],
      productName: productData.title,
      price: productData.price,
      promo: productData.promo
    };

    axios.post(`${baseURL}/api/slider-cards`, formData)
      .then(response => {
        setNotification('Картку створено успішно');
        setTimeout(() => setNotification(null), 3000);
        setProductPage('');
        setProductData(null);
      })
      .catch(error => {
        console.error('Помилка при створенні картки:', error);
        setNotification('Не вдалося створити картку.');
      });
  };

  return (
    <div className='create_container'>
      <form onSubmit={handleSubmit}>
        <div className='slider_card'>
          <p className='block_title'>Сторінка продукту</p>
          <select value={productPage} onChange={handleSelectChange}>
            <option value="">Виберіть сторінку продукту</option>
            {pages.map(page => (
              <option key={page._id} value={page._id}>{page.title}</option>
            ))}
          </select>
        </div>
        {productData && (
          <div className="product-preview">
            <img src={`${baseURL}/${productData.images[0]}`} alt={productData.title} />
            <div className="border_descr">
              <p>Назва: - {productData.title}</p>
              <p>Ціна: - {productData.price} грн</p>
              <p>Промо - {productData.promo}</p>
            </div>
          </div>
        )}
        <button className='create_slide' type="submit">Створити картку</button>
      </form>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
};

export default CreateTopSlider;