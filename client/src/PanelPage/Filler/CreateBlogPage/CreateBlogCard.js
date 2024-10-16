import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DownloadImage from '../../../Assets/other-icon/download.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const CreateBlogCard = () => {
  const [images, setImages] = useState([]);
  const [imageDetails, setImageDetails] = useState('');
  const [text, setText] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [existingPages, setExistingPages] = useState([]);
  const [existingCards, setExistingCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    axios.get(`${baseURL}/api/blogpages`)
      .then(response => setExistingPages(response.data))
      .catch(error => console.error('Error fetching blog pages:', error));

    axios.get(`${baseURL}/api/blogcards`)
      .then(response => setExistingCards(response.data))
      .catch(error => console.error('Error fetching blog cards:', error));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImageDetails(files.length > 1 ? `${files.length} зображень` : files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('text', text);
    formData.append('pageId', selectedPage);
    images.forEach(image => formData.append('images', image));

    try {
      if (editingCard) {
        await axios.put(`${baseURL}/api/blogcards/${editingCard._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setNotification('Картка блогу успішно оновлена');
      } else {
        await axios.post(`${baseURL}/api/blogcards`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setNotification('Картка блогу успішно створена');
      }

      resetForm();
      axios.get(`${baseURL}/api/blogcards`)
        .then(response => setExistingCards(response.data))
        .catch(error => console.error('Error fetching blog cards:', error));
    } catch (error) {
      console.error('Error saving blog card:', error);
      setNotification('Сталася помилка під час збереження картки блогу');
    }

    setTimeout(() => setNotification(''), 3000);
  };

  const handleEditCard = (card) => {
    setText(card.text);
    setSelectedPage(card.pageId);
    setEditingCard(card);
    setImages([]);
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await axios.delete(`${baseURL}/api/blogcards/${cardId}`);
      setNotification('Картка блогу успішно видалена');
      setExistingCards(existingCards.filter(card => card._id !== cardId));
    } catch (error) {
      console.error('Error deleting blog card:', error);
      setNotification('Сталася помилка під час видалення картки блогу');
    }

    setTimeout(() => setNotification(''), 3000);
  };

  const resetForm = () => {
    setText('');
    setImages([]);
    setSelectedPage('');
    setEditingCard(null);
    setImageDetails('');
  };

  return (
    <div className='create_container'>
      <h2 className='create_title'>{editingCard ? 'Редагувати картку блогу' : 'Створити картку блогу'}</h2>
      <form className='form' onSubmit={handleSubmit}>
        <div className='upload-item'>
          <input
            type="file"
            id="file-input"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input" className="custom-upload">
            <img src={DownloadImage} alt="Завантажити" />
            <span>{imageDetails || 'Завантажити картинку'}</span>
          </label>
        </div>
        <p>Заголовок картки</p>
        <input
          type="text"
          placeholder="Заголовок картки"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <p>Підключення картки до сторінки блогу</p>
        <select onChange={(e) => setSelectedPage(e.target.value)} value={selectedPage}>
          <option value="">Виберіть сторінку блогу</option>
          {existingPages.map(page => (
            <option key={page._id} value={page._id}>{page.title}</option>
          ))}
        </select>
        <button className='create_slide' type="submit">{editingCard ? 'Оновити картку' : 'Створити картку'}</button>
      </form>

      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}

      <div className="existing-cards">
        <h3 className='create_title'>Існуючі картки блогу</h3>
        {existingCards.map(card => (
          <div key={card._id} className="blog-card">
            <img src={`${baseURL}${card.image}`} alt="Blog" />
            <div className="card_title-button">
              <p>{card.text}</p>
              <div className="card_button">
                <button onClick={() => handleEditCard(card)}>Редагувати</button>
                <button onClick={() => handleDeleteCard(card._id)}>Видалити</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateBlogCard;