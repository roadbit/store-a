import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const DeleteTopSlider = () => {
  const [selectedCardId, setSelectedCardId] = useState('');
  const [cards, setCards] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    axios.get(`${baseURL}/api/slider-cards`)
      .then(response => setCards(response.data))
      .catch(error => console.error('Помилка при завантаженні карток:', error));
  }, []);

  const handleDelete = () => {
    axios.delete(`${baseURL}/api/slider-cards/${selectedCardId}`)
      .then(response => {
        setCards(cards.filter(card => card._id !== selectedCardId));
        setSelectedCardId('');
        setNotification('Картку видалено успішно');
        setTimeout(() => setNotification(null), 3000);
      })
      .catch(error => {
        console.error('Помилка при видаленні картки:', error);
        setNotification('Не вдалося видалити картку.');
      });
  };

  return (
    <div className='delete_slide'>
      <p className='block_title'>Виберіть картку для видалення</p>
      <select value={selectedCardId} onChange={(e) => setSelectedCardId(e.target.value)}>
        <option value="">Виберіть картку</option>
        {cards.map(card => (
          <option key={card._id} value={card._id}>{card.productName}</option>
        ))}
      </select>
      <button className='create_slide' onClick={handleDelete} disabled={!selectedCardId}>Видалити картку</button>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
};

export default DeleteTopSlider;