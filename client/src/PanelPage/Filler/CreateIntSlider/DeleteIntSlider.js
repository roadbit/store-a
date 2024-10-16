import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const IntCardDelete = () => {
  const [selectedCardId, setSelectedCardId] = useState('');
  const [cards, setCards] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    axios.get(`${baseURL}/api/int-slider-cards`)
      .then(response => setCards(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleDelete = () => {
    axios.delete(`${baseURL}/api/int-slider-cards/${selectedCardId}`)
      .then(response => {
        setCards(cards.filter(card => card._id !== selectedCardId));
        setSelectedCardId('');
        setNotification('Картку видалено успішно');
        setTimeout(() => setNotification(''), 3000);
      })
      .catch(error => {
        console.error('Error deleting card:', error);
        setNotification('Помилка при видаленні картки');
        setTimeout(() => setNotification(''), 3000);
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
        <div className='notification'>
          {notification}
        </div>
      )}
    </div>
  );
};

export default IntCardDelete;