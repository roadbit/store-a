import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomSelect from '../Components/CustomSelect';
import { useReview } from '../ReviewContext';
import IconEnter from '../Assets/other-icon/enter.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [filter, setFilter] = useState('default');
  const [showReplyIndex, setShowReplyIndex] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('');

  const [likeDisabled, setLikeDisabled] = useState({});
  const [dislikeDisabled, setDislikeDisabled] = useState({});

  const { reviewCount, setReviewCount } = useReview(); 

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(`${baseURL}/api/reviews`, {
          params: { productId },
        });
        setReviews(response.data);
        setReviewCount(response.data.length);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
    fetchReviews();
  }, [setReviewCount, productId]);

  const handleSubmit = async () => {
    const newReview = {
      name,
      pros,
      cons,
      reviewText,
      date: new Date(),
      rating,
      likes: 0,
      dislikes: 0,
      replies: [],
      productId
    };

    try {
      await axios.post(`${baseURL}/api/reviews`, newReview);
      setReviews([newReview, ...reviews]);
      setShowForm(false);
      setReviewCount(reviews.length + 1);
      setPros('');
      setCons('');
      setReviewText('');
      setName('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting the review:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setPros('');
    setCons('');
    setReviewText('');
    setName('');
    setRating(0);
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const toggleReply = (index) => {
    if (showReplyIndex === index) {
      setShowReplyIndex(null);
    } else {
      setShowReplyIndex(index);
    }
  };

  const handleReplySubmit = async (id) => {
    const newReply = {
      text: replyText,
      name: replyName,
      date: new Date(),
    };

    try {
      const updatedReview = reviews.find((review) => review._id === id);
      updatedReview.replies = [...(updatedReview.replies || []), newReply];

      await axios.put(`${baseURL}/api/reviews/${id}`, updatedReview);
      setReviews(reviews.map((review) => (review._id === id ? updatedReview : review)));
      setReplyText('');
      setReplyName('');
      setShowReplyIndex(null);
    } catch (error) {
      console.error('Error submitting the reply:', error);
    }
  };

  const handleReplyCancel = () => {
    setReplyText('');
    setReplyName('');
    setShowReplyIndex(null);
  };

  const handleLike = async (id) => {
    try {
      const updatedReview = reviews.find((review) => review._id === id);
      updatedReview.likes += 1;

      await axios.put(`${baseURL}/api/reviews/${id}`, { likes: updatedReview.likes });
      setReviews(reviews.map((review) => (review._id === id ? updatedReview : review)));
      setLikeDisabled((prev) => ({ ...prev, [id]: true }));
    } catch (error) {
      console.error('Error updating the like count:', error);
    }
  };

  const handleDislike = async (id) => {
    try {
      const updatedReview = reviews.find((review) => review._id === id);
      updatedReview.dislikes += 1;

      await axios.put(`${baseURL}/api/reviews/${id}`, { dislikes: updatedReview.dislikes });
      setReviews(reviews.map((review) => (review._id === id ? updatedReview : review)));
      setDislikeDisabled((prev) => ({ ...prev, [id]: true }));
    } catch (error) {
      console.error('Error updating the dislike count:', error);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (filter) {
      case 'byUsefulness':
        return b.likes - a.likes;
      case 'byDate':
        return new Date(b.date) - new Date(a.date);
      case 'byRating':
        return b.rating - a.rating;
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const filterOptions = [
    { value: 'default', label: 'Сортувати відгуки' },
    { value: 'default', label: 'За замовчуванням' },
    { value: 'byUsefulness', label: 'За корисністю' },
    { value: 'byDate', label: 'По даті' },
    { value: 'byRating', label: 'За рейтингом' },
  ];

  return (
    <div className="rev_container">
      <div className="rev_btn-filter">
        <button className="text-rev_btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Скасувати' : 'Додати відгук'}
        </button>
  
        <div className="filter_rev">
          <CustomSelect
            options={filterOptions}
            value={filterOptions.find((opt) => opt.value === filter)}
            onChange={(selectedOption) => {
              setFilter(selectedOption.value);
            }}
          />
        </div>
      </div>
  
      {showForm && (
        <div className="review-form">
          <div className="form_input-item">
            <p className="form_rev-title">Напишіть відгук</p>
            <p className="name_rev-user">Ваше ім'я</p>
            <input
              className="name_input"
              type="text"
              placeholder="Ваше ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="input_l">
              <p className="text_l">Переваги</p>
              <textarea
                value={pros}
                onChange={(e) => setPros(e.target.value)}
              />
            </div>
            <div className="input_l">
              <p className="text_l">Недоліки</p>
              <textarea
                value={cons}
                onChange={(e) => setCons(e.target.value)}
              />
            </div>
            <p className="text_l">Ваш відгук</p>
            <textarea
              className="rev_text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="rating">
              <p>Ваша оцінка:</p>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  className="btn_like"
                  key={value}
                  onClick={() => handleRatingClick(value)}
                  style={{ backgroundColor: rating >= value ? '#568cfd' : 'transparent' }}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="rev_config-btn-item">
              <button onClick={handleSubmit}>Надіслати відгук</button>
              <button onClick={handleCancel}>Скасувати</button>
            </div>
          </div>
        </div>
      )}
  
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>Відгуків ще не має, будьте першим хто додасть відгук!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {sortedReviews.map((review) => (
            <div key={review._id} className="review-item">
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
  
              <div className="com_rev-return__com">
                <button onClick={() => toggleReply(review._id)} className="rev-return_btn">
                  <img src={IconEnter} alt="img" /> Відповісти
                </button>
                <div className="rev_con-like__btn">
                  <p>Відгук був корисний?</p>
                  <button
                    className="like__btn"
                    onClick={() => handleLike(review._id)}
                    disabled={likeDisabled[review._id]}
                  >
                    👍 {review.likes}
                  </button>
                  <button
                    className="like__btn"
                    onClick={() => handleDislike(review._id)}
                    disabled={dislikeDisabled[review._id]}
                  >
                    👎 {review.dislikes}
                  </button>
                </div>
              </div>
  
              {showReplyIndex === review._id && (
                <div className="reply-form">
                  <p>Ваше ім'я</p>
                  <input
                    type="text"
                    value={replyName}
                    onChange={(e) => setReplyName(e.target.value)}
                  />
                  <p>Ваша відповідь</p>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="reply-buttons">
                    <button onClick={() => handleReplySubmit(review._id)}>Відповісти</button>
                    <button onClick={handleReplyCancel}>Скасувати</button>
                  </div>
                </div>
              )}
  
              {review.replies && review.replies.length > 0 && (
                <div className="replies-list">
                  {review.replies.map((reply) => (
                    <div key={reply.date} className="reply-item">
                      <div className="reply-header">
                        <p>{reply.name}</p>
                        <span>
                          {new Intl.DateTimeFormat('uk-UA', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          }).format(new Date(reply.date))}
                        </span>
                      </div>
                      <p className="reply_user-text">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;