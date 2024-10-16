import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './slider.css'

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function LastViewedProducts() {
  const [viewedProducts, setViewedProducts] = useState([]);
  const sliderRef = useRef(null);

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

  useEffect(() => {
    const slider = sliderRef.current;

    if (slider) {
      const handleWheel = (e) => {
        e.preventDefault();
        slider.scrollLeft += e.deltaY > 0 ? 100 : -100;
      };

      slider.addEventListener('wheel', handleWheel);

      return () => {
        slider.removeEventListener('wheel', handleWheel);
      };
    }
  }, [viewedProducts]);

  if (viewedProducts.length === 0) {
    return null;
  }

  return (
    <div className="last-viewed-products">
      <h2>Переглянуті продукти</h2>

      <div className="product_cards-view" ref={sliderRef}>
        {viewedProducts.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="product_card">
            <img src={`${baseURL}/${product.image}`} alt={product.title} className="product_card-img" />
            <div className="title_price-rev__container">
              <h3 className="product_card-title">{product.title}</h3>
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

export default LastViewedProducts;