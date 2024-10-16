import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DownloadImage from '../../../Assets/other-icon/download.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const PodcategoryCardForm = () => {
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageDetails, setImageDetails] = useState('');
  const [categoryPages, setCategoryPages] = useState([]);
  const [selectedCategoryPageId, setSelectedCategoryPageId] = useState('');
  const [podcategoryCards, setPodcategoryCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingMode, setEditingMode] = useState(false);
  const [deletingMode, setDeletingMode] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchCategoryPages();
    fetchPodcategoryCards();
  }, []);

  const fetchCategoryPages = async () => {
    try {
      const response = await axios.get(`${baseURL}/categorypages`);
      setCategoryPages(response.data);
    } catch (error) {
      console.error('Error fetching category pages:', error);
    }
  };

  const fetchPodcategoryCards = async () => {
    try {
      const response = await axios.get(`${baseURL}/podcategorycards`);
      setPodcategoryCards(response.data);
    } catch (error) {
      console.error('Error fetching subcategory cards:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageDetails(`${file.name} (${file.type})`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('categoryPageId', selectedCategoryPageId);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axios.post(`${baseURL}/podcategorycards`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNotification('Успішно створено');
      fetchPodcategoryCards();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification('Помилка');
    }
  };

  const handleEdit = async () => {
    if (!selectedCard) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('categoryPageId', selectedCategoryPageId);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axios.put(`${baseURL}/podcategorycards/${selectedCard._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNotification('Успішно оновлено');
      fetchPodcategoryCards();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification('Помилка');
    }
  };

  const handleDelete = async () => {
    if (!selectedCard) return;

    try {
      await axios.delete(`${baseURL}/podcategorycards/${selectedCard._id}`);
      setNotification('Успішно видалено');
      fetchPodcategoryCards();
      resetForm();
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
    setImageFile(null);
    setImageDetails('');
    setSelectedCategoryPageId('');
  };

  const handleSelectCardForEdit = (card) => {
    setSelectedCard(card);
    setTitle(card.title);
    setSelectedCategoryPageId(card.categoryPageId);
    setEditingMode(true);
    setDeletingMode(false);
  };

  return (
    <div className='create_container' style={{ position: 'relative' }}>
      <p className='create_title'>Створити картку підкатегорії</p>
      <form className='form' onSubmit={handleSubmit}>
        <p className="block_title">Назва підкатегорії</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Назва картки, наприклад: 'Монітори'"
          disabled={deletingMode}
        />

        <select
          value={selectedCategoryPageId}
          onChange={(e) => setSelectedCategoryPageId(e.target.value)}
          disabled={deletingMode}
          className='page-category'
        >
          <option value="">Виберіть сторінку категорії</option>
          {categoryPages.map(page => (
            <option key={page._id} value={page._id}>{page.title}</option>
          ))}
        </select>
        
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
        <p className='edit_title'>Редагувати картку підкатегорії</p>
        <select
          value={selectedCard ? selectedCard._id : ''}
          onChange={(e) => {
            const card = podcategoryCards.find(card => card._id === e.target.value);
            handleSelectCardForEdit(card);
          }}
          disabled={deletingMode}
        >
          <option value="">Виберіть картку для редагування</option>
          {podcategoryCards.map(card => (
            <option key={card._id} value={card._id}>{card.title}</option>
          ))}
        </select>

        {editingMode && (
          <div className="edit_block">
            <p>Нова назва картки</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Нова назва картки"
            />

            <div className='upload-item'>
              <input
                type="file"
                id="edit-file-input"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="edit-file-input" className="custom-upload">
                <div>
                  <img src={DownloadImage} alt="Завантажити" />
                  <span>{imageDetails || 'Замінити картинку'}</span>
                </div>
              </label>
              <div className="edit_podcategory-btn">
                <button className='save_btn' onClick={handleEdit}>Зберегти зміни</button>
                <button className='cencel_btn' onClick={resetForm}>Відмінити редагування</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="delete_card">
        <p className='delete_title'>Видалити картку підкатегорії</p>
        <select
          value={selectedCard ? selectedCard._id : ''}
          onChange={(e) => {
            const card = podcategoryCards.find(card => card._id === e.target.value);
            setSelectedCard(card);
            setEditingMode(false);
            setDeletingMode(true);
          }}
          disabled={editingMode}
          className='delete-select_podcategory'
        >
          <option value="">Виберіть картку для видалення</option>
          {podcategoryCards.map(card => (
            <option key={card._id} value={card._id}>{card.title}</option>
          ))}
        </select>

        {deletingMode && (
          <div className="delete_btn-item">
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

export default PodcategoryCardForm;