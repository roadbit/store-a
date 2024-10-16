import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const ProductPageDelete = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/productpages`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Помилка завантаження продуктів:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, products]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProductChange = (id) => {
    setSelectedProductId(id);
    setIsDropdownOpen(false);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProductId) {
      alert('Будь ласка, виберіть продукт для видалення.');
      return;
    }

    try {
      await axios.delete(`${baseURL}/api/productpages/${selectedProductId}`);
      setNotification('Успішно видалена');

      setProducts(products.filter(product => product._id !== selectedProductId));
      setSelectedProductId('');
    } catch (error) {
      console.error('Помилка видалення сторінки продукту:', error);
      setNotification('Помилка');
    }
  };

  return (
    <div>
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
      <button className='create_page-btn' onClick={handleDeleteProduct} disabled={!selectedProductId}>
        Видалити сторінку
      </button>

      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}
    </div>
  );
};

export default ProductPageDelete;