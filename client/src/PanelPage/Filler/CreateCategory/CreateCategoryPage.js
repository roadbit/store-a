import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const CategoryPageForm = () => {
  const [cards, setCards] = useState([]);
  const [categoryPages, setCategoryPages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [deletingMode, setDeletingMode] = useState(false);
  const [deleteSelectValue, setDeleteSelectValue] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchCategoryPages();
    fetchCards();
  }, []);

  const fetchCategoryPages = async () => {
    try {
      const response = await axios.get(`${baseURL}/categorypages`);
      setCategoryPages(response.data);
    } catch (error) {
      console.error('Error fetching category pages:', error);
    }
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${baseURL}/catalogcards`);
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedCardId) {
        const selectedCard = cards.find(card => card._id === selectedCardId);
        const title = selectedCard?.title || '';

        const categoryPage = await axios.post(`${baseURL}/categorypages`, { title });
        setNotification('Успішно створено');

        await axios.put(`${baseURL}/catalogcards/${selectedCardId}/category`, { categoryPageId: categoryPage.data._id });

        fetchCategoryPages();
        resetForm();
      } else {
        setNotification('Оберіть картку перед створенням');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification('Помилка');
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await axios.delete(`${baseURL}/categorypages/${selectedCategory._id}`);
      setNotification('Успішно видалено');
      fetchCategoryPages();
      resetForm();
    } catch (error) {
      console.error('Error deleting page:', error);
      setNotification('Помилка');
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setSelectedCardId('');
    setDeleteSelectValue('');
    setDeletingMode(false);
  };

  return (
    <div className='create_container' style={{ position: 'relative' }}>
      <form onSubmit={handleSubmit}>
        <p className='create_title'>Створити сторінку категорії</p>
        <div className="create_category">
          <p>Сторінка категорії каталогу</p>
          <select
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
            disabled={deletingMode}
          >
            <option value="">Оберіть категорію каталогу</option>
            {cards.map(card => (
              <option key={card._id} value={card._id}>{card.title}</option>
            ))}
          </select>
          <button className='save_btn' type="submit" disabled={deletingMode}>
            Створити категорію
          </button>
        </div>
      </form>

      <div className='delete_category'>
        <p className='delete_title'>Видалити сторінку категорії</p>
        <select
          value={deleteSelectValue}
          onChange={(e) => {
            const page = categoryPages.find(page => page._id === e.target.value);
            setSelectedCategory(page);
            setDeletingMode(true);
            setDeleteSelectValue(page._id);
          }}
        >
          <option value="">Оберіть категорію для видалення</option>
          {categoryPages.map(page => (
            <option key={page._id} value={page._id}>{page.title}</option>
          ))}
        </select>

        {deletingMode && (
          <div className='delete_btn-item'>
            <button className='save_btn' onClick={handleDelete}>Видалити категорію</button>
            <button className='cencel_btn' onClick={resetForm}>Відмінити видалення</button>
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
};

export default CategoryPageForm;