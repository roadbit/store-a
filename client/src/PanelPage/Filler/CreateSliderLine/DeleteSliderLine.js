import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const DeleteSliderLine = () => {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    axios.get(`${baseURL}/api/cardlineproducts`)
      .then(response => setCards(response.data))
      .catch(error => console.error('Error fetching cardline products:', error));
  }, []);

  const handleDelete = () => {
    if (!selectedCardId) {
      setNotification('Будь ласка, виберіть картку для видалення.');
      return;
    }

    axios.delete(`${baseURL}/api/cardlineproducts/${selectedCardId}`)
      .then(response => {
        setNotification('Картка успішно видалена!');
        setCards(cards.filter(card => card._id !== selectedCardId));
        setSelectedCardId('');
      })
      .catch(error => {
        console.error('Error deleting card:', error);
        setNotification('Помилка при видаленні картки.');
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
      <button className='card_line-btn' onClick={handleDelete}>Видалити картку</button>
    </div>
  );
};

export default DeleteSliderLine;