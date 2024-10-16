import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DownloadImage from '../../../Assets/other-icon/download.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const CreateSliderLine = () => {
  const [image, setImage] = useState(null);
  const [imageDetails, setImageDetails] = useState('');
  const [title, setTitle] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [podCategories, setPodCategories] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    axios.get(`${baseURL}/podcategorypages`)
      .then(response => {
        setPodCategories(response.data);
      })
      .catch(error => console.error('Error fetching podcategories:', error));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageDetails(`${file.name} (${file.type})`);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePageChange = (e) => {
    setSelectedPage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!image || !title || !selectedPage) {
      setNotification('Будь ласка, заповніть всі поля.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('page', selectedPage);

    axios.post(`${baseURL}/api/cardlineproducts`, formData)
      .then(response => {
        setNotification('Картка успішно створена!');
        setImage(null);
        setImageDetails('');
        setTitle('');
        setSelectedPage('');
      })
      .catch(error => {
        console.error('Error creating card:', error);
        setNotification('Помилка при створенні картки.');
      });
  };

  const resetNotification = () => {
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  useEffect(() => {
    if (notification) resetNotification();
  }, [notification]);

  return (
    <div>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      <form className='line_form' onSubmit={handleSubmit}>
        <p className='create_title'>Слайдер рекомендованих категорій</p>
        <div className='upload-item'>
          <input
            type="file"
            id="file-input"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            required
          />
          <label htmlFor="file-input" className="custom-upload">
            <img src={DownloadImage} alt="Завантажити" />
            <span>{imageDetails || 'Завантажити картинку'}</span>
          </label>
        </div>

        <div className='edit_card'>
          <p className='block_title'>Назва категорії</p>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={handleTitleChange} 
            required
            placeholder='Назва категорії'
          />
          <p className='block_title'>Сторінка підкатегорії:</p>
          <select 
            id="page" 
            value={selectedPage} 
            onChange={handlePageChange} 
            required
          >
            <option value="" disabled>Виберіть сторінку підкатегорії</option>
            {podCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name || category.title}
              </option>
            ))}
          </select>
        </div>
        <div className='line__select'>
        </div>
        <button className='card_line-btn' type="submit">Створити</button>
      </form>
    </div>
  );
};

export default CreateSliderLine;