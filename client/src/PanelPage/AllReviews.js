import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function AllReviews() {
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReviews, setSelectedReviews] = useState([]);

  useEffect(() => {
    async function fetchAllReviews() {
      try {
        const response = await axios.get(`${baseURL}/api/reviews/all`);
        setAllReviews(response.data);
      } catch (error) {
        console.error('Error fetching all reviews:', error);
        setError('Не вдалося завантажити відгуки.');
      } finally {
        setLoading(false);
      }
    }
    fetchAllReviews();
  }, []);

  const handleSelect = (id) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((reviewId) => reviewId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await axios.delete(`${baseURL}/api/reviews`, { data: { ids: selectedReviews } });
      setAllReviews(allReviews.filter((review) => !selectedReviews.includes(review._id)));
      setSelectedReviews([]);
    } catch (error) {
      console.error('Error deleting reviews:', error);
      setError('Не вдалося видалити відгуки.');
    }
  };

  if (loading) return <p>Завантаження відгуків...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="all-reviews-container">
      <h2>Всі відгуки користувачів</h2>

      <button onClick={handleDeleteSelected} disabled={!selectedReviews.length}>
        Видалити відгук
      </button>

      <div className="reviews-list">
        {allReviews.map((review) => (
          <div key={review._id} className="review-item">
            <input
              type="checkbox"
              checked={selectedReviews.includes(review._id)}
              onChange={() => handleSelect(review._id)}
            />

            <div className="product-link">
              <p>Відгук залишений на сторінці:</p>
              <Link target="blank" to={`/product/${review.productId._id}`}>
                {review.productId.title}
              </Link>
            </div>

            <div className="rev_name-data">
              <div className="rev_com-name__rating">
                <p className="rev_con-name">
                  <strong>{review.name}</strong>
                </p>
                <p className="rev_con-rating">
                  <strong>Оцінка:</strong> {review.rating}
                </p>
              </div>
              <p className="rev_com-data">
                {new Date(review.date).toLocaleString('uk-UA', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            <p className="rev_com-text">{review.reviewText}</p>
            <p className="rev_com-text-like">
              <span className="rev_com-text-rev">Переваги: </span>
              <span className="rev_com-span">{review.pros}</span>
            </p>
            <p className="rev_com-text-dlike">
              <span className="rev_com-text-rev">Недоліки: </span>
              <span className="rev_com-span">{review.cons}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllReviews;