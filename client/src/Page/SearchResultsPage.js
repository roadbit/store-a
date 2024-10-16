import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Components/Nav'
import Footer from '../Components/Footer'
import WishIcon from '../Assets/icon-page/wish-icon.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function SearchResultsPage() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    if (query) {
      fetchAndFilterProducts(query);
    }
  }, [query]);

  const fetchAndFilterProducts = async (query) => {
    try {
      const response = await axios.get(`${baseURL}/api/search-productcards`, {
        params: { query },
        headers: { 'Cache-Control': 'no-cache' }
      });

      console.log('Знайдені продукти:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Помилка при завантаженні продуктів:', error);
    }
  };

  const getPromoLabelClass = (promoLabel) => {
    switch (promoLabel) {
      case 'АКЦІЯ':
        return 'promo_label action';
      case 'ТОП ПРОДАЖУ':
        return 'promo_label top-sale';
      case 'ХІТ ПРОДАЖУ':
        return 'promo_label hit';
      case 'НОВИНКА':
        return 'promo_label new';
      default:
        return 'promo_label';
    }
  };

  const getPriceColor = (price, oldPrice, promo) => {
    if (promo || price < oldPrice) return 'red';
    return 'black';
  };

  return (
    <div className='main-container'>
      <Nav />
      <div className="container">
        <div className="search-results-container">
          <h1>Результати пошуку для: "{query}"</h1>
          {products.length > 0 ? (
            <div className="podcategory_grid-card">
              {products.map((product) => {
                const isPriceDecreased = product.oldPrice && product.price < product.oldPrice;

                return (
                  <Link to={`/product/${product.productPageId}`} className="product_card-pod" key={product._id}>
                    {product.promoLabel && (
                      <div className={getPromoLabelClass(product.promoLabel)}>
                        {product.promoLabel}
                      </div>
                    )}
                    <button className="card_wish-bnt">
                      <img src={WishIcon} alt="Wish Icon" className="wish-card_product-img"/>
                    </button>
                    <img src={`${baseURL}/${product.image}`} alt={product.title} className="product_card-img-pod"
                    />
                    <div className="title_price-rev__container">
                      <p className="product_card-title-pod">{product.title}</p>
                      <span className="stock_title">В наявності</span>
                      <div className="price-info">
                        {isPriceDecreased ? (
                          <div className='card_price-old__current'>
                            <span className="old_price-pod" style={{ color: 'black' }}>
                              {product.oldPrice} ₴
                            </span>
                            <span className="product_card-price-pod" style={{ color: getPriceColor(product.price, product.oldPrice, product.promo) }}>
                              {product.price} ₴
                            </span>
                          </div>
                        ) : (
                          <span className="product_card-price-pod" style={{ color: getPriceColor(product.price, product.oldPrice, product.promo) }}>
                            {product.price} ₴
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="card-characteristics">
                      {product.characteristics && product.characteristics.map((char, index) => (
                        <p key={index} className="hidden-characteristic">
                          {char.name}: {char.value}
                        </p>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p>Продукти не знайдено</p>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default SearchResultsPage;