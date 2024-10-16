import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Nav from '../Components/Nav';
import Footer from '../Components/Footer';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const BlogPage = () => {
  const [blogCards, setBlogCards] = useState([]);

  useEffect(() => {
    axios.get(`${baseURL}/api/blogcards`)
      .then(response => setBlogCards(response.data))
      .catch(error => console.error('Error fetching blog cards:', error));
  }, []);

  return (
    <div className='main-container'>
      <div className="container">
        <Nav />
        <h1 className='blog_title'>Корисні огляди</h1>
        <div className="grid_item-card">
          {blogCards.map(card => (
            <a key={card._id} href={`/blog/${card.pageId}`} className="blog_card">
              <img src={`${baseURL}${card.image}`} alt="Blog" />
              <p className="card_blog-title">{card.text}</p>
            </a>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default BlogPage;