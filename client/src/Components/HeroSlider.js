import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import LeftIcon from '../Assets/slider-icon/left.svg';
import RightIcon from '../Assets/slider-icon/right.svg';

import './slider.css';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const CustomNextArrow = ({ onClick, visible }) => (
  <div className={`arrow_btn next ${visible ? 'visible' : ''}`} onClick={onClick}>
    <img src={RightIcon} alt="Next" />
  </div>
);

const CustomPrevArrow = ({ onClick, visible }) => (
  <div className={`arrow_btn prev ${visible ? 'visible' : ''}`} onClick={onClick}>
    <img src={LeftIcon} alt="Previous" />
  </div>
);

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const sliderRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    axios.get(`${baseURL}/api/hero-slides`)
      .then(response => {
        setSlides(response.data);
      })
      .catch(error => console.error("Error fetching slides:", error));
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <CustomNextArrow visible={hovered} />,
    prevArrow: <CustomPrevArrow visible={hovered} />,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  return (
    <div
      className="slider_container"
      ref={sliderRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Slider {...settings}>
        {slides.map((slide) => (
          <Link key={slide._id} to={`/podcategorypage/${slide.categoryPageId._id}`}>
            <img 
              src={`${baseURL}${slide.url}`} 
              alt={`Slide ${slide._id}`} 
            />
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;