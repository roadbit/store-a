import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DownloadImage from '../../../Assets/other-icon/download.svg';
import DeleteImage from '../../../Assets/icon-nav/delete-icon.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const warrantyOptions = [
  'тиждень', 'тижня', 'тижнів',
  'місяць', 'місяця', 'місяців',
  'рік', 'роки', 'років'
];

function EditProductPage() {
  const { id: initialId } = useParams();
  const [id, setId] = useState(initialId);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [descrTitle, setDescrTitle] = useState('');
  const [descrText, setDescrText] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [promo, setPromo] = useState('');
  const [characteristics, setCharacteristics] = useState([{ name: '', value: '' }]);
  const [warranty, setWarranty] = useState('');
  const [warrantyTerm, setWarrantyTerm] = useState('місяців');
  const [imageDetails, setImageDetails] = useState('');
  const [notification, setNotification] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/productpages`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Помилка завантаження всіх продуктів:', error);
      }
    };

    fetchAllProducts();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const response = await axios.get(`${baseURL}/api/productpages/${id}`);
          const productData = response.data;
          setTitle(productData.title);
          setPrice(productData.price);
          setOldPrice(productData.oldPrice || '');
          setDescrTitle(productData.descrTitle);
          setDescrText(productData.descrText);
          setPromo(productData.promo || '');
          setCharacteristics(productData.characteristics || [{ name: '', value: '' }]);

          if (productData.warranty) {
            const { value, unit } = productData.warranty;
            setWarranty(value || '');
            setWarrantyTerm(unit || 'місяців');
          }
        }
      } catch (error) {
        console.error('Помилка завантаження продукту:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setImageDetails(files.length > 1 ? `${files.length} картинок` : files[0]?.name);
  };

  const handleCharacteristicChange = (index, key, value) => {
    const newCharacteristics = [...characteristics];
    newCharacteristics[index][key] = value;
    setCharacteristics(newCharacteristics);
  };

  const handleAddCharacteristic = () => {
    setCharacteristics([...characteristics, { name: '', value: '' }]);
  };

  const handleRemoveCharacteristic = (index) => {
    const newCharacteristics = characteristics.filter((_, charIndex) => charIndex !== index);
    setCharacteristics(newCharacteristics);
  };

  const handleSaveChanges = async () => {
    if (!id) {
      alert('ID продукту не визначено');
      return;
    }

    const response = await axios.get(`${baseURL}/api/productpages/${id}`);
    const productData = response.data;

    let updatedOldPrice = productData.oldPrice;
    let updatedPromo = promo;

    if (parseFloat(price) < parseFloat(productData.price)) {
      updatedOldPrice = productData.price;
      updatedPromo = 'АКЦІЯ';
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('oldPrice', updatedOldPrice);
    formData.append('promo', updatedPromo);
    formData.append('descrTitle', descrTitle);
    formData.append('descrText', descrText);
    formData.append('characteristics', JSON.stringify(characteristics));
    formData.append('warranty', JSON.stringify({ value: warranty, unit: warrantyTerm }));

    if (newImages.length > 0) {
      newImages.forEach((image) => {
        formData.append('images', image);
      });
    }

    try {
      await axios.put(`${baseURL}/api/productpages/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNotification('Зміни збережено');
    } catch (error) {
      console.error('Помилка збереження змін:', error);
      alert('Помилка збереження змін. Перевірте консоль для деталей.');
    }
  };

  const handleProductChange = async (newId) => {
    setId(newId);
    if (newId) {
      try {
        const response = await axios.get(`${baseURL}/api/productpages/${newId}`);
        const productData = response.data;
        setTitle(productData.title);
        setPrice(productData.price);
        setOldPrice(productData.oldPrice || '');
        setDescrTitle(productData.descrTitle);
        setDescrText(productData.descrText);
        setPromo(productData.promo || '');
        setCharacteristics(productData.characteristics || [{ name: '', value: '' }]);
        setIsDropdownOpen(false);

        if (productData.warranty) {
          const { value, unit } = productData.warranty;
          setWarranty(value || '');
          setWarrantyTerm(unit || 'місяців');
        }
      } catch (error) {
        console.error('Помилка завантаження нового продукту:', error);
      }
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='create_container'>
      <h1 className='create_title'>Редагувати продукт</h1>

      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}

      <div className="custom__select">
        <div className="selected" onClick={toggleDropdown}>
          <p>{selectedProductId ? products.find(product => product._id === selectedProductId)?.title || "Оберіть продукт" : "Оберіть продукт"}</p>
          <img src="" alt="" />
        </div>

        {isDropdownOpen && (
          <div className="dropdown">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Пошук продукту"
              style={{ marginBottom: '10px' }}
            />
            <div className="options">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="option"
                    onClick={() => handleProductChange(product._id)}
                  >
                    {product.title}
                  </div>
                ))
              ) : (
                <div className="option">Нічого не знайдено</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='input_block'>
        <p className='block_title'>Нова назва продукту</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Нова назва продукту"
        />
        <p className='block_title'>Нова ціна продукту</p>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Нова ціна продукту"
        />
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
          <span>{imageDetails || 'Завантажити нові картинки'}</span>
        </label>
      </div>
      
      <div className='promo_block'>
        <p className='block_title'>Промо продукту</p>
        <select value={promo} onChange={(e) => setPromo(e.target.value)}>
          <option value="">Оберіть промо</option>
          <option value="АКЦІЯ">АКЦІЯ</option>
          <option value="ТОП ПРОДАЖУ">ТОП ПРОДАЖУ</option>
          <option value="ХІТ ПРОДАЖУ">ХІТ ПРОДАЖУ</option>
          <option value="НОВИНКА">НОВИНКА</option>
        </select>
      </div>
      
      <div className='input_block'>
        <h3 className='block_title'>Гарантія</h3>
        <input
          type="number"
          value={warranty}
          onChange={(e) => setWarranty(e.target.value)}
          placeholder="Термін гарантії"
          min="1"
        />
        <select value={warrantyTerm} onChange={(e) => setWarrantyTerm(e.target.value)}>
          {warrantyOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className='input_block'>
        <h3 className='block_title'>Характеристики</h3>
        {characteristics.map((char, index) => (
          <div className='char-item' key={index} style={{ display: 'flex', marginBottom: '10px' }}>
            <input
              type="text"
              value={char.name}
              onChange={(e) => handleCharacteristicChange(index, 'name', e.target.value)}
              placeholder="Назва характеристики"
              style={{ marginRight: '10px' }}
            />
            <input
              type="text"
              value={char.value}
              onChange={(e) => handleCharacteristicChange(index, 'value', e.target.value)}
              placeholder="Значення характеристики"
              style={{ marginRight: '10px' }}
            />
            <button className='remove_btn' onClick={() => handleRemoveCharacteristic(index)}><img src={DeleteImage} alt="Видалити" /></button>
          </div>
        ))}
        <button className='ch_btn' onClick={handleAddCharacteristic}>Додати ще характеристику</button>
      </div>

      <div className='input_block'>
        <p className='block_title'>Новий заголовок опису</p>
        <input
          type="text"
          value={descrTitle}
          onChange={(e) => setDescrTitle(e.target.value)}
          placeholder="Новий заголовок опису продукту"
        />
        <p className='block_title'>Новий текст опису</p>
        <textarea
          value={descrText}
          onChange={(e) => setDescrText(e.target.value)}
          placeholder="Новий текст опису продукту"
        />
      </div>

      <button className='create_page-btn' onClick={handleSaveChanges}>Зберегти зміни</button>
    </div>
  );
}

export default EditProductPage;