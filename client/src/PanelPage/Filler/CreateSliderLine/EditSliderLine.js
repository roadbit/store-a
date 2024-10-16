import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DownloadImage from '../../../Assets/other-icon/download.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const EditSliderLine = () => {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imageDetails, setImageDetails] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    axios.get(`${baseURL}/api/cardlineproducts`)
      .then(response => setCards(response.data))
      .catch(error => console.error('Error fetching cardline products:', error));
  }, []);

  useEffect(() => {
    if (selectedCardId) {
      const card = cards.find(c => c._id === selectedCardId);
      if (card) {
        setTitle(card.title);
        setImage(card.image);
        setImageDetails(card.image ? card.image.split('/').pop() : '');
      }
    }
  }, [selectedCardId, cards]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageDetails(`${file.name} (${file.type})`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    if (image) {
      formData.append('image', image);
    }

    axios.patch(`${baseURL}/api/cardlineproducts/${selectedCardId}`, formData)
      .then(response => {
        setNotification('Картка успішно відредагована!');
        setTitle('');
        setImage(null);
        setImageDetails('');
        setSelectedCardId('');
      })
      .catch(error => {
        console.error('Error updating card:', error);
        setNotification('Помилка при редагуванні картки.');
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
    <div className='edit__line'>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      <form className='line_form' onSubmit={handleSubmit}>
        <div className='card_line-select'>
          <p className='block_title'>Виберіть картку</p>
          <select
            id="card-select"
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
          >
            <option value="">Виберіть картку</option>
            {cards.map(card => (
              <option key={card._id} value={card._id}>
                {card.title}
              </option>
            ))}
          </select>
        </div>
        {selectedCardId && (
          <>
            <div className='card_line-select'>
              <p className='block_title'>Нова назва картки</p>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <p className='block_title'>Завантажити нову картинку:</p>
            <div className='upload-item'>
              <input
                type="file"
                id="file-input"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-input" className="custom-upload">
                <img src={DownloadImage} alt="Завантажити" />
                <span>{imageDetails || 'Завантажити нове зображення'}</span>
              </label>
            </div>
            <button className='card_line-btn' type="submit">Зберегти зміни</button>
          </>
        )}
      </form>
    </div>
  );
};

export default EditSliderLine;