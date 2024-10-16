import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DownloadImage from '../../../Assets/other-icon/download.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const CatalogCardForm = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imageDetails, setImageDetails] = useState('');
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingMode, setEditingMode] = useState(false);
  const [deletingMode, setDeletingMode] = useState(false);
  const [notification, setNotification] = useState('');
  const [editSelectValue, setEditSelectValue] = useState('');
  const [deleteSelectValue, setDeleteSelectValue] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${baseURL}/catalogcards`);
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageDetails(`${file.name} (${file.type})`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    if (image) formData.append('image', image);

    try {
      if (selectedCard) {
        await axios.put(`${baseURL}/catalogcards/${selectedCard._id}`, formData);
        setNotification('Успішно створено');
      } else {
        await axios.post(`${baseURL}/catalogcards`, formData);
        setNotification('Успішно створено');
      }
      fetchCards();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification('Помилка створення');
    }
  };

  const handleEdit = (card) => {
    setSelectedCard(card);
    setTitle(card.title);
    setEditingMode(true);
    setDeletingMode(false);
    setEditSelectValue(card._id);
    setDeleteSelectValue('');
  };

  const handleDelete = async () => {
    if (!selectedCard) return;

    try {
      await axios.delete(`${baseURL}/catalogcards/${selectedCard._id}`);
      setNotification('Успішно видалено');
      fetchCards();
      resetForm();
      setDeleteSelectValue('');
    } catch (error) {
      console.error('Error deleting card:', error);
      setNotification('Помилка');
    }
  };

  const resetForm = () => {
    setEditingMode(false);
    setDeletingMode(false);
    setSelectedCard(null);
    setTitle('');
    setImage(null);
    setImageDetails('');
    setEditSelectValue('');
    setDeleteSelectValue('');
  };

  return (
    <div className='create_container' style={{ position: 'relative' }}>
      <p className='create_title'>Створити категорію каталогу</p>
      <form className='form' onSubmit={handleSubmit}>
        <p>Назва категорії каталогу</p>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Назва, наприклад: 'Товари для геймерів'"
          disabled={deletingMode}
        />
        <div className='upload-item'>
          <input
            type="file"
            id="file-input"
            onChange={handleImageChange}
            disabled={deletingMode}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input" className="custom-upload">
            <img src={DownloadImage} alt="Завантажити" />
            <span>{imageDetails || 'Завантажити картинку'}</span>
          </label>
          <button className='save_btn' type="submit" disabled={deletingMode}>Зберегти</button>
        </div>
      </form>

      <div className='edit_card'>
        <p className='edit_title'>Редагувати категорію каталогу</p>
        <select
          value={editSelectValue}
          onChange={(e) => {
            const card = cards.find(card => card._id === e.target.value);
            handleEdit(card);
          }}
          disabled={deletingMode}
        >
          <option value="">Виберіть картку для редагування</option>
          {cards.map(card => (
            <option key={card._id} value={card._id}>{card.title}</option>
          ))}
        </select>

        {editingMode && (
          <div className="edit_block" style={{ marginTop: '20px' }}>
            <p>Нова назва</p>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Зміна назви категорії"
            />
            <div className='upload-item'>
              <input
                type="file"
                id="file-input"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-input" className="custom-upload">
                <img src={DownloadImage} alt="Оновити" />
                <span>{imageDetails || 'Оновити картинку'}</span>
              </label>
            </div>
            <div className="item_btn">
              <button className='save_btn' onClick={handleSubmit}>Зберегти зміни</button>
              <button className='cencel_btn' onClick={resetForm}>Відмінити редагування</button>
            </div>
          </div>
        )}
      </div>

      <div className="delete_card">
        <p className='delete_title'>Видалити категорію каталогу</p>
        <select
          value={deleteSelectValue}
          onChange={(e) => {
            const card = cards.find(card => card._id === e.target.value);
            setSelectedCard(card);
            setEditingMode(false);
            setDeletingMode(true);
            setEditSelectValue('');
            setDeleteSelectValue(e.target.value);
          }}
          disabled={editingMode}
        >
          <option value="">Виберіть картку для видалення</option>
          {cards.map(card => (
            <option key={card._id} value={card._id}>{card.title}</option>
          ))}
        </select>

        {deletingMode && (
          <div className='delete_btn-item'>
            <button className='save_btn' onClick={handleDelete}>Видалити картку</button>
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

export default CatalogCardForm;