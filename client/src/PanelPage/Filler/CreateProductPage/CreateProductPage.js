import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../Page/page.css'
import DownloadImage from '../../../Assets/other-icon/download.svg';
import DeleteImage from '../../../Assets/icon-nav/delete-icon.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function CreateProductPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [descrTitle, setDescrTitle] = useState('');
  const [descrText, setDescrText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productCards, setProductCards] = useState([]);
  const [selectedProductCard, setSelectedProductCard] = useState('');
  const [promo, setPromo] = useState('');
  const [characteristics, setCharacteristics] = useState([{ name: '', value: '' }]);
  const [warrantyValue, setWarrantyValue] = useState('');
  const [warrantyUnit, setWarrantyUnit] = useState('місяців');
  const [imageDetails, setImageDetails] = useState('');
  const [notification, setNotification] = useState('');

  const warrantyOptions = [
    'тиждень', 'тижня', 'тижнів',
    'місяць', 'місяця', 'місяців',
    'рік', 'роки', 'років'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductCards(selectedCategory);
    }
  }, [selectedCategory]);

  const generateRandomCode = () => Math.floor(1000000 + Math.random() * 9000000).toString();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
  
    if (validFiles.length !== files.length) {
      setNotification('Будь ласка, завантажте лише зображення.');
      setTimeout(() => setNotification(''), 5000);
      return;
    }
  
    setImages(validFiles);
    setImageDetails(validFiles.length > 1 ? `${validFiles.length} картинок` : validFiles[0].name);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/podcategorypages`);
      setCategories(response.data);
    } catch (error) {
      console.error('Помилка при завантаженні підкатегорій:', error);
    }
  };

  const fetchProductCards = async (categoryId) => {
    try {
      const response = await axios.get(`${baseURL}/api/productcards?podcategoryPageId=${categoryId}`);
      setProductCards(response.data);
    } catch (error) {
      console.error('Помилка при завантаженні продуктів:', error);
    }
  };

  const handleCharacteristicChange = (index, key, value) => {
    const newCharacteristics = [...characteristics];
    newCharacteristics[index][key] = value;
    setCharacteristics(newCharacteristics);
  };

  const handleAddCharacteristic = () => {
    setCharacteristics([...characteristics, { name: '', value: '' }]);
  };

  const handleCreatePage = async () => {
    if (!title || !price || images.length === 0 || !descrTitle || !descrText || !selectedCategory) {
      setNotification('Будь ласка, заповніть всі поля та завантажте хоча б одну картинку.');
      return;
    }
  
    const formData = new FormData();
    const newCode = generateRandomCode();
  
    formData.append('title', title);
    formData.append('code', newCode);
    formData.append('price', price);
    formData.append('descrTitle', descrTitle);
    formData.append('descrText', descrText);
    formData.append('podcategoryPageId', selectedCategory);
  
    if (promo) {
      formData.append('promo', promo);
    }
  
    images.forEach((image) => formData.append('images', image));
    formData.append('characteristics', JSON.stringify(characteristics));
    formData.append('warranty', JSON.stringify({ value: warrantyValue, unit: warrantyUnit }));
  
    try {
      const response = await axios.post(`${baseURL}/api/productpages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setNotification('Сторінку створено');
      resetForm();
  
      setTimeout(() => {
        setNotification('');
      }, 5000);
    } catch (error) {
      console.error('Помилка при створенні сторінки:', error);
      setNotification('Помилка при створенні сторінки. Спробуйте ще раз.');
      setTimeout(() => {
        setNotification('');
      }, 5000);
    }
  }; 

  const handleRemoveCharacteristic = (index) => {
    const newCharacteristics = characteristics.filter((_, i) => i !== index);
    setCharacteristics(newCharacteristics);
  };

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setImages([]);
    setImageDetails('');
    setDescrTitle('');
    setDescrText('');
    setSelectedCategory('');
    setSelectedProductCard('');
    setPromo('');
    setWarrantyValue('');
    setWarrantyUnit('місяців');
    setCharacteristics([{ name: '', value: '' }]);
  
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className='create_container'>
      <h2 className='create_title'>Створення сторінки продукту</h2>

      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}

      <div className='input_block'>
        <p className='block_title'>Сторінки підкатегорій</p>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Оберіть підкатегорію</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <div className='input_block'>
        <p className='block_title'>Назва продукту</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Назва продукту"
        />
        <p className='block_title'>Ціна продукту</p>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ціна продукту"
        />
      </div>

      <div className='input_block'>
        <p className='block_title'>Промо продукту</p>
        <select value={promo} onChange={(e) => setPromo(e.target.value)}>
          <option value="">Оберіть промо</option>
          <option value="АКЦІЯ">АКЦІЯ</option>
          <option value="ТОП ПРОДАЖУ">ТОП ПРОДАЖУ</option>
          <option value="ХІТ ПРОДАЖУ">ХІТ ПРОДАЖУ</option>
          <option value="НОВИНКА">НОВИНКА</option>
        </select>
      </div>

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
          <span>{imageDetails || 'Завантажити картинки (не більше 7 картинок)'}</span>
        </label>
      </div>

      <div className='input_block'>
        <p className='block_title'>Термін гарантії продукту</p>
        <div className='input_block-g'>
          <input
            type="text"
            value={warrantyValue}
            onChange={(e) => setWarrantyValue(e.target.value)}
            placeholder="Термін гарантії"
          />
          <select
            value={warrantyUnit}
            onChange={(e) => setWarrantyUnit(e.target.value)}
          >
            {warrantyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='input_block'>
        <p className='block_title'>Характеристики</p>
        {characteristics.map((char, index) => (
          <div className='char-item' key={index} style={{ display: 'flex', marginBottom: '10px' }}>
            <input
              type="text"
              value={char.name}
              onChange={(e) => handleCharacteristicChange(index, 'name', e.target.value)}
              placeholder="Назва характеристики"
              style={{ marginRight: '10px', flexGrow: 1 }}
            />
            <input
              type="text"
              value={char.value}
              onChange={(e) => handleCharacteristicChange(index, 'value', e.target.value)}
              placeholder="Значення характеристики"
              style={{ marginRight: '10px', flexGrow: 1 }}
            />
            <button onClick={() => handleRemoveCharacteristic(index)} className='remove_btn'>
              <img src={DeleteImage} alt="Видалити" />
            </button>
          </div>
        ))}
        <button onClick={handleAddCharacteristic} className='ch_btn'>Додати характеристики</button>
      </div>

      <div className='input_block'>
        <p className='block_title'>Заголовок опису</p>
        <input
          type="text"
          value={descrTitle}
          onChange={(e) => setDescrTitle(e.target.value)}
          placeholder="Заголовок опису"
        />
        <p className='block_title'>Опис продукту</p>
        <textarea
          value={descrText}
          onChange={(e) => setDescrText(e.target.value)}
          placeholder="Опис продукту"
        />
      </div>

      <button className='create_page-btn' onClick={handleCreatePage}>Створити</button>
    </div>
  );
}

export default CreateProductPage;