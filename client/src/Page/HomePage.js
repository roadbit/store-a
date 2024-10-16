import React from 'react';
import Nav from '../Components/Nav'
import Footer from '../Components/Footer'
import HeroSlider from '../Components/HeroSlider'
import Slider from '../Components/SliderLine'

import TopSlider from '../Components/TopSlider'
import RecSlider from '../Components/RecSlider'
import IntSlider from '../Components/IntSlider'

import CartSummary from '../Components/CartSummary';
import LastViewedProducts from '../Components/LastViewedProducts';
import FeaturedCatalogCards from '../Components/FeaturedCatalogCards';

import RandomBlogCards from '../Components/RandomBlogCards'

import '../Page/page.css'


function HomePage() {
  return (
    <>
      <Nav />
      <div className='main-container'>
        <div className="container">
          <CartSummary />
          <HeroSlider />
          <FeaturedCatalogCards />
          <Slider />
          <LastViewedProducts />
          <TopSlider />
          <RecSlider />
          <IntSlider />
          <RandomBlogCards />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default HomePage;