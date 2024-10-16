import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function PodcategoryPageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [podcategoryCards, setPodcategoryCards] = useState([]);
  const [selectedPodcategoryCard, setSelectedPodcategoryCard] = useState('');
  const [podcategoryPages, setPodcategoryPages] = useState([]);
  const [selectedPodcategoryPage, setSelectedPodcategoryPage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchPodcategoryCards();
    fetchPodcategoryPages();
  }, []);

  const fetchPodcategoryCards = async () => {
    try {
      const response = await axios.get(`${baseURL}/podcategorycards`);
      setPodcategoryCards(response.data);
    } catch (error) {
      console.error('Error fetching podcategory cards:', error);
    }
  };

  const fetchPodcategoryPages = async () => {
    try {
      const response = await axios.get(`${baseURL}/podcategorypages`);
      setPodcategoryPages(response.data);
    } catch (error) {
      console.error('Error fetching podcategory pages:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(`${baseURL}/podcategorypages`, { podcategoryCardId: selectedPodcategoryCard });
      setNotification('Сторінка успішно створена.');
      handleCancel();
    } catch (error) {
      console.error('Error saving podcategory page:', error.response ? error.response.data : error.message); // Деталізоване логування
      setNotification('Помилка при збереженні сторінки.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/podcategorypages/${selectedPodcategoryPage}`);
      setNotification('Сторінка успішно видалена.');
      handleCancel();
    } catch (error) {
      console.error('Error deleting podcategory page:', error);
      setNotification('Помилка при видаленні сторінки.');
    }
  };

  const handleCancel = () => {
    setSelectedPodcategoryCard('');
    setSelectedPodcategoryPage('');
    setIsDeleting(false);
  };

  return (
    <div className='create_container'>
      <h1 className='create_title'>Створити сторінку підкатегорії</h1>
      <div className='form'>
        <select
          value={selectedPodcategoryCard}
          onChange={(e) => setSelectedPodcategoryCard(e.target.value)}
        >
          <option value="">Оберіть картку підкатегорії</option>
          {podcategoryCards.map(card => (
            <option key={card._id} value={card._id}>
              {card.title}
            </option>
          ))}
        </select>
        <button className='save-btn' onClick={handleSave}>Створити сторінку</button>
      </div>

      <div className="delete_card">
        <h2 className='delete_title'>Видалити сторінку</h2>
        <select
          value={selectedPodcategoryPage}
          onChange={(e) => {
            setSelectedPodcategoryPage(e.target.value);
            setIsDeleting(true);
          }}
        >
          <option value="">Оберіть сторінку для видалення</option>
          {podcategoryPages.map(page => (
            <option key={page._id} value={page._id}>
              {page.title}
            </option>
          ))}
        </select>

        {isDeleting && (
          <div className='delete_btn-item'>
            <button className='save_btn' onClick={handleDelete}>Видалити</button>
            <button className='cencel_btn' onClick={handleCancel}>Відмінити видалення</button>
          </div>
        )}
      </div>

      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}
    </div>
  );
}

export default PodcategoryPageForm;