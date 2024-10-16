import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './f-card.css'
import CatalogIcon from '../Assets/other-icon/catalog-icon.svg'

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function FeaturedCatalogCards() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchFeaturedCards();
  }, []);

  const fetchFeaturedCards = async () => {
    try {
      const response = await axios.get(`${baseURL}/catalogcards`);
      setCards(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching featured cards:', error);
    }
  };

  return (
    <div className="featured-catalog">
      <h2>Каталог продуктів</h2>
      <div className="catalog_card-grid">
        {cards.map(card => (
          <Link
            key={card._id}
            className="card_catalog"
            to={card.categoryPageId ? `/category/${card.categoryPageId}` : ''}
          >
            <img className='card_catalog-image' src={`${baseURL}/${card.image}`} alt={card.title} />
            <p className='card_catalog-title'>{card.title}</p>
          </Link>
        ))}
      </div>
      <button className="catalog-link_btn"><img src={CatalogIcon} alt='Каталог' /><Link to='/catalog'>Весь каталог</Link></button>
    </div>
  );
}

export default FeaturedCatalogCards;