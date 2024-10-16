import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const AddProductCardForm = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [podcategoryPages, setPodcategoryPages] = useState([]);
  const [selectedPodcategoryPage, setSelectedPodcategoryPage] = useState('');
  const [promoLabel, setPromoLabel] = useState('');

  useEffect(() => {
    fetchPodcategoryPages();
  }, []);

  const fetchPodcategoryPages = async () => {
    try {
      const response = await axios.get(`${baseURL}/podcategorypages`);
      setPodcategoryPages(response.data);
    } catch (error) {
      console.error('Error fetching podcategory pages:', error);
    }
  };

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('podcategoryPageId', selectedPodcategoryPage);
    formData.append('promoLabel', promoLabel);

    try {
      await axios.post(`${baseURL}/api/productcards`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product card created successfully!');
    } catch (error) {
      console.error('Error creating product card:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Назва продукту:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="price">Ціна:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="image">Завантажити зображення:</label>
        <input
          type="file"
          id="image"
          onChange={handleImageUpload}
          required
        />
      </div>

      <div>
        <label htmlFor="podcategoryPage">Оберіть сторінку:</label>
        <select
          id="podcategoryPage"
          value={selectedPodcategoryPage}
          onChange={(e) => setSelectedPodcategoryPage(e.target.value)}
          required
        >
          <option value="">Оберіть сторінку</option>
          {podcategoryPages.map((page) => (
            <option key={page._id} value={page._id}>
              {page.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="promoLabel">Промо мітка:</label>
        <select
          id="promoLabel"
          value={promoLabel}
          onChange={(e) => setPromoLabel(e.target.value)}
        >
          <option value="">Оберіть промо мітку</option>
          <option value="АКЦІЯ">АКЦІЯ</option>
          <option value="ТОП ПРОДАЖУ">ТОП ПРОДАЖУ</option>
          <option value="ХІТ ПРОДАЖУ">ХІТ</option>
          <option value="НОВИНКА">НОВИНКА</option>
        </select>
      </div>

      <button type="submit">Створити картку продукту</button>
    </form>
  );
};

export default AddProductCardForm;