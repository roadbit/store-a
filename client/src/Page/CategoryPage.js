import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavPanel from '../Components/Nav';
import Footer from '../Components/Footer'

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [podcategoryCards, setPodcategoryCards] = useState([]);

  useEffect(() => {
    fetchCategoryPage();
    fetchPodcategoryCards();
  }, [id]);

  const fetchCategoryPage = async () => {
    try {
      const response = await axios.get(`${baseURL}/categorypages/${id}`);
      setCategory(response.data);
    } catch (error) {
      console.error('Error fetching category page:', error);
    }
  };

  const fetchPodcategoryCards = async () => {
    try {
      const response = await axios.get(`${baseURL}/podcategorycards`);
      const podcategoryCards = response.data.filter(card => card.categoryPageId === id);
      const updatedPodcategoryCards = await Promise.all(
        podcategoryCards.map(async (card) => {
          try {
            const podcategoryPageResponse = await axios.get(`${baseURL}/podcategorypages`, {
              params: { podcategoryCardId: card._id }
            });
            const podcategoryPage = podcategoryPageResponse.data.find(page => page.podcategoryCardId === card._id);
            return { ...card, podcategoryPageId: podcategoryPage ? podcategoryPage._id : null };
          } catch (error) {
            console.error('Error fetching podcategory page for card:', error);
            return card;
          }
        })
      );

      setPodcategoryCards(updatedPodcategoryCards);
    } catch (error) {
      console.error('Error fetching podcategory cards:', error);
    }
  };

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <div className='main-container'>
      <div className="container">
        <NavPanel />
        <div className="category_content">
          <h1 className='category_title'>{category.title}</h1>
          <div className="category_grid-card">
            {podcategoryCards.map(card => (
              <Link
                key={card._id}
                to={`/podcategorypage/${card.podcategoryPageId || card._id}`}
                className="category_card"
              >
                <img className='category_card-image' src={`${baseURL}/${card.image}`} alt={card.title} />
                <p className='category_card-title'>{card.title}</p>
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default CategoryPage;