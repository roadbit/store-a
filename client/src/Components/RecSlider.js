import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import './slider.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const TopSlider = () => {
  const [slides, setSlides] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    axios.get(`${baseURL}/api/rec-slider-cards`)
      .then(response => setSlides(response.data))
      .catch(error => console.error('Error fetching slides', error));
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 955,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 780,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 490,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
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

  return (
    <div className="slider-container">
      <div className="slider-header">
        <h2>Рекомендоване</h2>
        <div className="arrows">
          <div
            className="arrow prev-arrow"
            onClick={() => sliderRef.current.slickPrev()}
          >
            &#10094;
          </div>
          <div
            className="arrow next-arrow"
            onClick={() => sliderRef.current.slickNext()}
          >
            &#10095;
          </div>
        </div>
      </div>
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide) => (
          <div key={slide._id} className="slider-card">
            <a href={`/product/${slide.productPage}`}>
              <img src={`${baseURL}/${slide.image}`} alt={slide.productName} />
              <p className='card_slider-title'>{slide.productName}</p>
              <p className='card_slider-price'>{slide.price} грн</p>
              {slide.promo && (
                <p className={getPromoLabelClass(slide.promo)}>
                  {slide.promo}
                </p>
              )}
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TopSlider;