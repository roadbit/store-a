import React, { useState, useEffect } from 'react';
import NavPanel from '../Components/Nav';
import Footer from '../Components/Footer'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import WishIcon from '../Assets/icon-page/wish-icon.svg';
import FilterSidebar from '../PanelPage/Filler/CreateFilter/FilterSidebar';
import SortDropdown from '../Components/SortDropdown';
import LastViewedProducts from '../Components/LastViewedProducts';
import IntSlider from '../Components/IntSlider'
import '../Components/slider.css';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function PodcategoryPage() {
  const { id } = useParams();
  const [podcategoryPage, setPodcategoryPage] = useState(null);
  const [productCards, setProductCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState('');
  const [sortType, setSortType] = useState('');

  useEffect(() => {
    fetchPodcategoryPage();
    fetchProductCards();
  }, [id]);

  const fetchPodcategoryPage = async () => {
    try {
      const response = await axios.get(`${baseURL}/podcategorypages/${id}`);
      setPodcategoryPage(response.data);
      setSubcategoryId(response.data._id);
    } catch (error) {
      console.error('Error fetching podcategory page:', error);
    }
  };

  const fetchProductCards = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/productcards?podcategoryPageId=${id}`);
      setProductCards(response.data);
      setFilteredCards(response.data);
    } catch (error) {
      console.error('Error fetching product cards:', error);
    }
  };

  const sortProducts = (cards, sortType) => {
    let sortedCards = [...cards];
    
    switch (sortType) {
      case 'lowToHigh':
        sortedCards.sort((a, b) => a.price - b.price);
        break;
      case 'highToLow':
        sortedCards.sort((a, b) => b.price - a.price);
        break;
      case 'topSales':
        sortedCards.sort((a, b) => (b.promoLabel === 'ТОП ПРОДАЖУ') - (a.promoLabel === 'ТОП ПРОДАЖУ'));
        break;
      case 'hitSales':
        sortedCards.sort((a, b) => (b.promoLabel === 'ХІТ ПРОДАЖУ') - (a.promoLabel === 'ХІТ ПРОДАЖУ'));
        break;
      case 'newArrivals':
        sortedCards.sort((a, b) => (b.promoLabel === 'НОВИНКА') - (a.promoLabel === 'НОВИНКА'));
        break;
      case 'promotions':
        sortedCards.sort((a, b) => (b.promoLabel === 'АКЦІЯ') - (a.promoLabel === 'АКЦІЯ'));
        break;
      default:
        break;
    }
    
    return sortedCards;
  };

  const handleSortChange = (sortType) => {
    setSortType(sortType);
  };

  useEffect(() => {
    setFilteredCards(sortProducts(productCards, sortType));
  }, [sortType, productCards]);

  const applyFilters = (selectedFilters) => {
    let filtered = [...productCards];

    if (Object.keys(selectedFilters).length > 0) {
      filtered = productCards.filter(card => {
        if (!card.characteristics || card.characteristics.length === 0) {
          return false;
        }

        return Object.entries(selectedFilters).every(([group, checkboxes]) => {
          const activeCheckboxes = Object.keys(checkboxes).filter(checkbox => checkboxes[checkbox]);

          if (activeCheckboxes.length > 0) {
            return card.characteristics.some(char =>
              char.name.toLowerCase() === group.toLowerCase() &&
              activeCheckboxes.includes(char.value)
            );
          }
          return true;
        });
      });
    }

    setFilteredCards(filtered);
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

  const getPriceColor = (currentPrice, oldPrice, promo) => {
    if (promo === 'АКЦІЯ') {
      return 'red';
    }
    return parseFloat(currentPrice) < parseFloat(oldPrice) ? 'red' : 'black';
  };

  return (
    <div className='main-container'>
      <div className="container">
        <NavPanel />
        <div className="podcategory_content">
          <h1 className='podcategory_title'>{podcategoryPage?.title}</h1>
          <div className="filter_grid-container">
            <div className="sort_filter">
              <FilterSidebar 
                subcategoryId={subcategoryId}
                productCards={productCards}
                onApplyFilters={applyFilters}
              />
              <SortDropdown onSortChange={handleSortChange} />
            </div>
            <div className="podcategory_grid-card">
              {filteredCards.length > 0 ? (
                filteredCards.map((product) => {
                  const isPriceDecreased = product.oldPrice && product.price < product.oldPrice;

                  return (
                    <Link to={`/product/${product.productPageId}`} className="product_card-pod" key={product._id}>
                      {product.promoLabel && (
                        <div className={getPromoLabelClass(product.promoLabel)}>
                          {product.promoLabel}
                        </div>
                      )}
                      <button className="card_wish-bnt">
                        <img src={WishIcon} alt="Wish Icon" className="wish-card_product-img" />
                      </button>
                      <img src={`${baseURL}/${product.image}`} alt={product.title} className="product_card-img-pod" />
                      <div className="title_price-rev__container">
                        <p className='product_card-title-pod'>{product.title}</p>
                        <span className="stock_title">В наявності</span>
                        <div className="price-info">
                          {isPriceDecreased && (
                            <div className='card_price-old__current'>
                              <span className="old_price-pod" style={{ color: 'black' }}>{product.oldPrice} ₴</span>
                              <span className="product_card-price-pod" style={{ color: getPriceColor(product.price, product.oldPrice, product.promo) }}>
                                {product.price} ₴
                              </span>
                            </div>
                          )}
                          {!isPriceDecreased && (
                            <span className="product_card-price-pod" style={{ color: getPriceColor(product.price, product.oldPrice, product.promo) }}>
                              {product.price} ₴
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="card-characteristics">
                        {product.characteristics && product.characteristics.map((char, index) => (
                          <p key={index} className="hidden-characteristic">{char.name}: {char.value}</p>
                        ))}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p>Немає продуктів у цій категорії</p>
              )}
            </div>
          </div>
          <LastViewedProducts />
          <IntSlider />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default PodcategoryPage;