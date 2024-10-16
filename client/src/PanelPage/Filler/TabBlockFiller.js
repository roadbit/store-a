import React, { useState } from 'react';

import CatalogCardForm from './CreateCatalog/CreateCatalogCard'
import CategoryPageForm from './CreateCategory/CreateCategoryPage'
import PodcategoryCardForm from './CreatePodcategoryCard/PodcategoryCardForm'
import PodcategoryPageForm from './CreatePodcategoryPage/PodcategoryPageForm'
import PageTab from './CreateProductPage/PageTab'
import CreateSlideForm from './CreateHeroSlider/CreateHeroSlider'
import TabLineSlider from './CreateSliderLine/TabLineSlide'
import TabSliderTop from './CreateTopSlider/TabSliderTop'
import TabIntSlider from './CreateIntSlider/TabIntSlider'
import TabRecSlider from './CreateRecSlider/TabRecSlider'
import CreateBlogPage from './CreateBlogPage/CreateBlogPage'
import CreateBlogCard from './CreateBlogPage/CreateBlogCard'
import TabFilters from './CreateFilter/TabFilter'

const TabBlockFiller = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Картки каталогу', content: <CatalogCardForm /> },
    { label: 'Сторінка категорії', content: <CategoryPageForm /> },
    { label: 'Картка підкатегорії', content: <PodcategoryCardForm /> },
    { label: 'Сторінка підкатегорії', content: <PodcategoryPageForm /> },
    { label: 'Сторінка продукту', content: <PageTab /> },
    { label: 'Фільтри пошуку', content: <TabFilters /> },
    { label: 'Слайдер головної сторінки', content: <CreateSlideForm /> },
    { label: 'Слайдер рекомендацій', content: <TabLineSlider /> },
    { label: 'Слайдер ТОП продажу', content: <TabSliderTop /> },
    { label: 'Слайдер Рекомендоване', content: <TabRecSlider /> },
    { label: 'Слайдер Може зацікавити', content: <TabIntSlider /> },
    { label: 'Сторінки блогу', content: <CreateBlogPage /> },
    { label: 'Картки блогу', content: <CreateBlogCard /> },
  ];

  return (
    <div className="tabs_filler-container">
      <div className="tabs_filler-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab_filler-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs_filler-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default TabBlockFiller;