import React, { useState, useEffect } from "react";
import axios from "axios";
import DownloadImage from '../../../Assets/other-icon/download.svg';
import DeleteImage from '../../../Assets/icon-nav/delete-icon.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const CreateSlideForm = () => {
  const [image, setImage] = useState(null);
  const [imageDetails, setImageDetails] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [podCategories, setPodCategories] = useState([]);
  const [slides, setSlides] = useState([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    axios.get(`${baseURL}/podcategorypages`)
      .then(response => {
        setPodCategories(response.data);
      })
      .catch(error => console.error("Error fetching podcategories:", error));
    
    axios.get(`${baseURL}/api/hero-slides`)
      .then(response => {
        setSlides(response.data);
      })
      .catch(error => console.error("Error fetching slides:", error));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageDetails(`${file.name} (${file.type})`);
    }
  };

  const handlePageChange = (e) => {
    setSelectedPage(e.target.value);
  };

  const handleCreateSlide = (e) => {
    e.preventDefault();

    if (!image || !selectedPage) {
      setNotification("Будь ласка, заповніть всі поля.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("categoryPageId", selectedPage);

    axios.post(`${baseURL}/api/hero-slides`, formData)
      .then(response => {
        setNotification("Слайд успішно створений!");
        setImage(null);
        setImageDetails('');
        setSelectedPage("");
        setSlides(prevSlides => [...prevSlides, response.data]);
      })
      .catch(error => {
        console.error("Error creating slide:", error);
        setNotification("Помилка при створенні слайду.");
      });
  };

  const handleDeleteSlide = (id) => {
    axios.delete(`${baseURL}/api/hero-slides/${id}`)
      .then(() => {
        setSlides(prevSlides => prevSlides.filter(slide => slide._id !== id));
        setNotification("Слайд успішно видалено.");
      })
      .catch(error => {
        console.error("Error deleting slide:", error);
        setNotification("Помилка при видаленні слайду.");
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
    <div className="create_slider-hero__form">
      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}
      <form onSubmit={handleCreateSlide}>
        <p className='create_title'>Створення слайдера головної сторінки</p>
        <div className='upload-item'>
          <input
            type="file"
            id="file-input"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            required
          />
          <label htmlFor="file-input" className="custom-upload">
            <img src={DownloadImage} alt="Завантажити" />
            <span>{imageDetails || 'Завантажити картинку'}</span>
          </label>
        </div>
        <div className='edit_card'>
          <p className='select_title'>Сторінка підкатегорії</p>
          <select
            id="page"
            value={selectedPage}
            onChange={handlePageChange}
            required
          >
            <option value="" disabled>Виберіть сторінку підкатегорії</option>
            {podCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <button className="create_slide-btn" type="submit">Створити слайд</button>
      </form>
      <h3 className='create_title'>Список слайдів</h3>
      <div className="slides_list">
        {slides.length > 0 ? (
          slides.map(slide => (
            <div key={slide._id} className="slide_item">
              <img src={`${baseURL}${slide.url}`} alt={`Slide ${slide._id}`} style={{ width: '100px', height: 'auto' }} />
              <button className='delete_icon-btn' onClick={() => handleDeleteSlide(slide._id)}><img src={DeleteImage}/></button>
            </div>
          ))
        ) : (
          <p>Слайдів немає.</p>
        )}
      </div>
    </div>
  );
};

export default CreateSlideForm;