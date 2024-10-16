import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DownloadImage from '../../../Assets/other-icon/download.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const CreateBlogPage = () => {
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [imageDetails, setImageDetails] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [existingPages, setExistingPages] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    axios.get(`${baseURL}/api/blogpages`)
      .then(response => setExistingPages(response.data))
      .catch(error => console.error('Error fetching blog pages:', error));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImageDetails(files.length > 1 ? `${files.length} картинок` : files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    images.forEach(image => formData.append('images', image));

    try {
      if (selectedPage) {
        await axios.put(`${baseURL}/api/blogpages/${selectedPage}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setNotification('Сторінка успішно оновлена');
      } else {
        await axios.post(`${baseURL}/api/blogpages`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setNotification('Сторінка успішно створена');
      }

      resetForm();
      const updatedPages = (await axios.get(`${baseURL}/api/blogpages`)).data;
      setExistingPages(updatedPages);
    } catch (error) {
      console.error('Error saving blog page:', error);
      setNotification('Сталася помилка під час збереження сторінки');
    }

    setTimeout(() => setNotification(''), 3000);
  };

  const handleDelete = async () => {
    if (!selectedPage) return;

    try {
      await axios.delete(`${baseURL}/api/blogpages/${selectedPage}`);
      setNotification('Сторінка успішно видалена');
      resetForm();
      const updatedPages = (await axios.get(`${baseURL}/api/blogpages`)).data;
      setExistingPages(updatedPages);
    } catch (error) {
      console.error('Error deleting blog page:', error);
      setNotification('Видалено успішно');
    }

    setTimeout(() => setNotification(''), 3000);
  };

  const handlePageSelection = async (e) => {
    const pageId = e.target.value;
    setSelectedPage(pageId);

    if (pageId) {
      const response = await axios.get(`${baseURL}/api/blogpages/${pageId}`);
      const { title, description, images } = response.data;
      setTitle(title);
      setDescription(description);
      setImages(images.map(image => image.url));
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImages([]);
    setSelectedPage('');
    setImageDetails('');
  };

  return (
    <div className='create_container'>
      <p className='create_title'>{selectedPage ? 'Редагувати сторінку блогу' : 'Створити сторінку блогу'}</p>
      <form className='form' onSubmit={handleSubmit}>
        <p className='block_title'>Заголовок сторінки блогу</p>
        <input
          type="text"
          placeholder="Заголовок сторінки блогу"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <p className='block_title'>Текст сторінки блогу</p>
        <textarea
          placeholder="Текст сторінки блогу"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        
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
            <span>{imageDetails || 'Завантажити картинки'}</span>
          </label>
        </div>

        <h3 className='create_title'>Редагувати існуючу сторінку</h3>
        <select className='edit_blog-select' onChange={handlePageSelection} value={selectedPage}>
          <option value="">Виберіть сторінку для редагування</option>
          {existingPages.map(page => (
            <option key={page._id} value={page._id}>{page.title}</option>
          ))}
        </select>
        
        <button className='create_slide' type="submit">{selectedPage ? 'Оновити сторінку' : 'Створити сторінку'}</button>
        {selectedPage && (<button className='delete_page' onClick={handleDelete}>Видалити сторінку</button>)}
      </form>

      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}
    </div>
  );
};

export default CreateBlogPage;