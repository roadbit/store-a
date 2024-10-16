import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavPanel from '../Components/Nav';
import Footer from '../Components/Footer'

import TopSlider from '../Components/TopSlider'
import RecSlider from '../Components/RecSlider'

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function CatalogPage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${baseURL}/catalogcards`);
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  return (
    <>
      <NavPanel />
      <div className='main-container'>
        <div className="container">
          <div className="catalog_content">
            <h1 className='catalog_title'>Каталог</h1>
            <div className="catalog_grid-card">
              {cards.map(card => (
                <Link
                  key={card._id}
                  className="catalog_card"
                  to={card.categoryPageId ? `/category/${card.categoryPageId}` : ''}
                >
                  <img className='card_image-catalog' src={`${baseURL}/${card.image}`} alt={card.title} />
                  <p className='card_title-catalog'>{card.title}</p>
                </Link>
              ))}
            </div>
          </div>
          <TopSlider />
          <RecSlider />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default CatalogPage;