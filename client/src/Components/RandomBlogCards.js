import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArrowIcon from '../Assets/other-icon/arrow.svg'

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const RandomBlogCards = () => {
  const [randomCards, setRandomCards] = useState([]);

  useEffect(() => {
    axios.get(`${baseURL}/api/blogcards`)
      .then(response => {
        const selectedCards = selectRandomCards(response.data);
        setRandomCards(selectedCards);
      })
      .catch(error => console.error('Error fetching blog cards:', error));
  }, []);

  const selectRandomCards = (cards) => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  return (
    <div className='random_blog_cards'>
      <div className="top_random-item">
        <h1>Корисні огляди</h1>
        <Link to='/blog-tsikave-ta-korysne' className="all_blog">Більше<img src={ArrowIcon} alt="icon" /></Link>
      </div>
      <div className="random_blog_cards_container">
        {randomCards.map(card => (
          <a key={card._id} href={`/blog/${card.pageId}`} className="blog_card">
            <img src={`${baseURL}${card.image}`} alt="Blog" />
            <p className="card_blog-title">{card.text}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RandomBlogCards;