import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './cabinet.css'

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function ViewedProducts() {
  const [viewedProducts, setViewedProducts] = useState([]);

  useEffect(() => {
    const storedViewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    setViewedProducts(storedViewedProducts);
    console.log('Завантажені продукти:', storedViewedProducts);
  }, []);

  const getPriceColor = (currentPrice, oldPrice, promo) => {
    if (promo === 'АКЦІЯ') {
      return 'red';
    }
    return parseFloat(currentPrice) < parseFloat(oldPrice) ? 'red' : 'black';
  };

  if (viewedProducts.length === 0) {
    return null;
  }

  return (
    <div className="last-viewed-products">
      <h2>Переглянуті продукти</h2>

      <div className="product-view">
        {viewedProducts.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="viev_card">
            <img src={`${baseURL}/${product.image}`} alt={product.title} className="view-img" />
            <div className="title_price-rev__container">
              <h3 className="view-title">{product.title}</h3>
              <div className="product_price-item">
                {product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price) && (
                  <p className="old_price">{parseFloat(product.oldPrice).toLocaleString('uk-UA')} ₴</p>
                )}
                <p
                  className="product_card-price"
                  style={{ color: getPriceColor(product.price, product.oldPrice, product.promo) }}
                >
                  {parseFloat(product.price).toLocaleString('uk-UA')} ₴
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ViewedProducts;