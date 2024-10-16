import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavPanel from '../Components/Nav';
import Footer from '../Components/Footer'
import Reviews from '../Page/Reviews';
import { useCart } from '../CartContext'; 
import { useReview } from '../ReviewContext';
import ChatBtn from '../PanelPage/Chat/ChatBtn';
import './page.css'
import ReturnPolicyModal from '../Components/ReturnPolicyModal';
import WarrantyModal from '../Components/WarrantyModal';

import TopSlider from '../Components/TopSlider'
import RecSlider from '../Components/RecSlider'
import LastViewedProducts from '../Components/LastViewedProducts';

import PayLogo5 from '../Assets/icon-pay/24-pay.png';
import PayLogo1 from '../Assets/icon-pay/apay-icon.png';
import PayLogo2 from '../Assets/icon-pay/gpay-icon.webp';
import PayLogo3 from '../Assets/icon-pay/mastercard.svg';
import PayLogo4 from '../Assets/icon-pay/visa.jpg';
import PayLogo6 from '../Assets/icon-pay/iban.png';
import WishImage from '../Assets/icon-page/wish-icon.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [isInCart, setIsInCart] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { reviewCount, setReviewCount } = useReview();
  const [wishlist, setWishlist] = useState([]);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false)

  const openReturnModal = () => setIsReturnModalOpen(true);
  const closeReturnModal = () => setIsReturnModalOpen(false);
  const openWarrantyModal = () => setIsWarrantyModalOpen(true);
  const closeWarrantyModal = () => setIsWarrantyModalOpen(false);

  const addToWishlist = () => {
    const newWishlistItem = {
      id: product._id,
      name: product.title,
      image: product.images[0],
      url: `/product/${id}`,
    };

    const updatedWishlist = [...wishlist, newWishlistItem];
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  }

  const isInWishlist = wishlist.some(item => item.id === product?._id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/productpages/${id}`);
        setProduct(response.data);

        const reviewResponse = await axios.get(`${baseURL}/api/reviews/count/${id}`);
        setReviewCount(reviewResponse.data.count); 
      } catch (error) {
        console.error('Помилка завантаження продукту або кількості відгуків:', error);
      }
    };

    fetchProduct();
  }, [id, setReviewCount]); 

  useEffect(() => {
    const itemInCart = cartItems.find(cartItem => cartItem.id === id);
    setIsInCart(!!itemInCart);
  }, [cartItems, id]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (product?.images.length || 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (product?.images.length || 1)) % (product?.images.length || 1));
  };

  const handleAddToCartClick = () => {
    const item = {
      id,
      title: product.title,
      price: product.price,
      image: product.images[currentIndex],
    };
    addToCart(item);
    setIsInCart(true);
  };

  const getPromoColor = (promo) => {
    switch (promo) {
      case 'АКЦІЯ':
        return 'red';
      case 'ТОП ПРОДАЖУ':
      case 'ХІТ ПРОДАЖУ':
        return 'orange';
      case 'НОВИНКА':
        return 'green';
      default:
        return 'black';
    }
  };

  const getPriceColor = (currentPrice, oldPrice, promo) => {
    if (promo === 'АКЦІЯ') {
      return 'red';
    }
    return parseFloat(currentPrice) < parseFloat(oldPrice) ? 'red' : 'black';
  };

  useEffect(() => {
    if (product) {
      const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
      const newProduct = {
        id: product._id,
        title: product.title,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.images[0],
      };

      const isAlreadyViewed = viewedProducts.some((item) => item.id === product._id);
  
      if (!isAlreadyViewed) {
        const updatedViewedProducts = [newProduct, ...viewedProducts].slice(0, 50);
        localStorage.setItem('viewedProducts', JSON.stringify(updatedViewedProducts));
      }
    }
  }, [product]);

  if (!product) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className='main-container'>
      <div className="container">
        <NavPanel />
        <div className="product_page-tabs">
          <ul className="tabs_list">
            <li className={activeTab === 'general' ? 'active_tab' : ''} onClick={() => handleTabChange('general')}>Все про товар</li>
            <li className={activeTab === 'specs' ? 'active_tab' : ''} onClick={() => handleTabChange('specs')}>Характеристики</li>
            <li className={activeTab === 'reviews' ? 'active_tab' : ''} onClick={() => handleTabChange('reviews')}>Відгуки<p>{reviewCount}</p></li>
          </ul>

          <div className="tab_content">
            {activeTab === 'general' && (
              <div className="tab_section">
                <div className="page_grid">
                  <div className="left_item">
                    <div className="slider">
                      <div className="main-image">
                        <p
                          className={`promo_slider-interest ${product.promo === 'АКЦІЯ' ? 'action' : product.promo === 'ТОП ПРОДАЖУ' || product.promo === 'ХІТ ПРОДАЖУ' ? 'top-sale' : product.promo === 'НОВИНКА' ? 'new' : ''}`}
                          data-promo={product.promo}
                        >
                          {product.promo}
                        </p>
                        <img src={`${baseURL}/${product.images[currentIndex]}`} alt="Product" />
                        <button className="prev" onClick={prevSlide}>❮</button>
                        <button className="next" onClick={nextSlide}>❯</button>
                      </div>
                      <div className="thumbnails">
                        {product.images.map((image, index) => (
                          <img
                            key={index}
                            src={`${baseURL}/${image}`}
                            alt="Thumbnail"
                            className={index === currentIndex ? 'active' : ''}
                            onClick={() => setCurrentIndex(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="right_item">
                    <h1 className="product_title">{product.title}</h1>
                    <div className="cod_stock-item">
                      <p>Є в наявності</p>
                      <span className="page_product-code">Код: {product.code}</span>
                    </div>
                    <div className="price_order-wish_btn-item">
                      <div className="product_price-item">
                        {product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price) && (
                          <p className="old_price-product">{parseFloat(product.oldPrice).toLocaleString('uk-UA')} грн</p>
                        )}
                        <p
                          className="current_price-product"
                          style={{ color: getPriceColor(product.price, product.oldPrice, product.promo) }}
                        >
                          {parseFloat(product.price).toLocaleString('uk-UA')} грн
                        </p>
                      </div>
                      <div className="order_wish-item">
                        <button
                          className={`order_btn ${isInCart ? 'inactive' : ''}`}
                          onClick={handleAddToCartClick}
                          disabled={isInCart}
                        >
                          {isInCart ? 'У кошику' : 'Купити'}
                        </button>
                        <button 
                          className="product_wish-btn" 
                          onClick={addToWishlist}
                          disabled={isInWishlist}
                        >
                          <img src={WishImage} alt="wish" />
                          {isInWishlist ? '' : ''}
                        </button>
                      </div>
                    </div>
                    <div className="delivery_descr">
                      <p className='delivery_title'>Доставка:</p>
                      <div className='devivery_post'><span>З відділення "Нова Пошта"</span><span>Від 50 грн</span></div>
                      <div className='devivery_post'><span>З поштомату "Нова Пошта"</span><span>Від 50 грн</span></div>
                      <div className='devivery_post'><span>Доставка за адресою</span><span>Від 50 грн</span></div>
                      <div className='devivery_post'><span>Укрпошта</span><span>Від 20 грн</span></div>
                    </div>
                    <div className="pay_descr">
                      <p className='pay_title'>Оплата:</p>
                      <p className='pay_method'>Оплата готівкою, банківська картка, ApplePay, GPay, MasterCard, VISA, Розрахунковий рахунок, Переказ на картку.</p>
                    </div>
                    <div className="pay_icon">
                      <img className='pay-icon_descr-24' src={PayLogo5} alt="img" />
                      <img className='pay-icon_descr-a' src={PayLogo1} alt="img" />
                      <img className='pay-icon_descr-g' src={PayLogo2} alt="img" />
                      <img className='pay-icon_descr' src={PayLogo3} alt="img" />
                      <img className='pay-icon_descr' src={PayLogo4} alt="img" />
                      <img className='pay-icon_descr-iban' src={PayLogo6} alt="img" />
                    </div>
                    <div className="return_descr">
                      <p className='return_title'>Гарантія та повернення:</p>
                      <p className="return-text">Обмін/повернення товару належної якості протягом 14 днів. <button onClick={openReturnModal}>Детальніше</button></p>
                      {product.warranty ? (
                        <p className="return-text">
                          Офіційна гарантія виробника: <span>{product.warranty.value} {product.warranty.unit}</span>
                          <button onClick={openWarrantyModal}>Детальніше</button>
                        </p>
                      ) : (
                        <p className="return-text">Гарантія не вказана</p>
                      )}
                    </div>
                  </div>
                </div>
                <ReturnPolicyModal isOpen={isReturnModalOpen} onClose={closeReturnModal} />
                <WarrantyModal isOpen={isWarrantyModalOpen} onClose={closeWarrantyModal} warranty={product.warranty} />
                <div className="bottom_descr-container">
                  <div className="left_descr-item">
                    <p className="left_descr-title">Опис: {product.title}</p>
                    <p className="descr_title">{product.descrTitle}</p>
                    <p className="descr_text">{product.descrText}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="tab_section">
                <div className="prod_char-container__order">
                  <div className="prod_char-container">
                    <p className="left_descr-title">Характеристики: {product.title}</p>
                    <div className="col_char-container">
                      {product.characteristics && product.characteristics.length > 0 ? (
                        product.characteristics.map((char, index) => (
                          <div className="char_item" key={index}>
                            <div className="char_col-left">
                              <span>{char.name}</span>
                            </div>
                            <div className="char_col-right">
                              <span>{char.value}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>Немає характеристик для цього товару.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab_section">
                <Reviews productId={product._id} />
              </div>
            )}

          </div>
        </div>
        <LastViewedProducts />
        <TopSlider />
        <RecSlider />
        <Footer />
        <ChatBtn />
      </div>
    </div>
  );
}

export default ProductPage;