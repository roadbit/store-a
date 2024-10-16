import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import Nav from '../Components/Nav';
import Footer from '../Components/Footer';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const BlogPageTemplate = () => {
  const { id } = useParams();
  const [pageData, setPageData] = useState(null);
  const [error, setError] = useState(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/blogpages/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setPageData(data);
        } else {
          const text = await response.text();
          setError('Unexpected response format');
        }
      } catch (error) {
        setError('Failed to fetch blog page data');
      }
    };

    fetchPageData();
  }, [id]);

  useEffect(() => {
    const imageContainer = imageContainerRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      imageContainer.scrollLeft += e.deltaY > 0 ? 100 : -100;
    };

    if (imageContainer) {
      imageContainer.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (imageContainer) {
        imageContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  if (error) {
    return <div>Помилка: {error}</div>;
  }

  if (!pageData) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className='main-container'>
      <div className="container">
        <Nav />
        <h1 className='blog_title-page'>{pageData.title}</h1>
        <div className="blog_page-content" ref={imageContainerRef}>
          {pageData.images.map((image, index) => (
            <div className="img_item-blog">
              <img key={index} src={`${baseURL}/${image}`} alt={`Blog Image ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="blog_descr-text">
          <p className='page_descr-text'>{pageData.description}</p>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default BlogPageTemplate;