import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './slider.css';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const Slider = () => {
  const sliderRef = useRef(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const slider = sliderRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      slider.scrollLeft += e.deltaY > 0 ? 100 : -100;
    };

    slider.addEventListener('wheel', handleWheel);

    return () => {
      slider.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    axios.get(`${baseURL}/api/cardlineproducts`)
      .then(response => {
        setCards(response.data);
      })
      .catch(error => {
        console.error('Error fetching cardline products:', error);
      });
  }, []);

  return (
    <>
      <p className='slider_line-title'>Популярні категорії</p>
      <div className="slider_container-line" ref={sliderRef}>
        {cards.map(card => (
          <Link key={card._id} className='card_product-line' to={`/podcategorypage/${card.page._id}`}>
            <img className='image_card-line' src={`${baseURL}/uploads/${card.image}`} alt={card.title} />
            <p className='title_card-line'>{card.title}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Slider;