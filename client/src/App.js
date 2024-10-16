import React, { useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';

import HomePage from './Page/HomePage';

import Login from './Page/Login';
import Cabinet from './Page/Cabinet/Cabinet';
import ProtectedRoute from './ProtectedRoute';

import ProductPage from './Page/ProductPage';
import OrderPage from './Page/Order';
import ConfOrdPage from './Page/ConfigOrder';

import CatalogPage from './Page/CatalogPage';
import CategoryPage from './Page/CategoryPage';
import PodcategoryPage from './Page/PodcategoryPage';
import BlogPage from './Page/BlogPage';
import BlogPageTemplate from './Page/BlogPageTemlate';

import TermsOfUse from './Page/TermsOfUse';
import ProductReturn from './Page/ProductReturn';
import PrivacyPolicy from './Page/PrivacyPolicy';

import SearchResultsPage from './Page/SearchResultsPage';

import PanelPage from './PanelPage/PanelPage';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

function App() {
  useEffect(() => {
    axios.post(`${baseURL}/api/visits`)
      .then(response => {})
      .catch(error => {});
  }, []);

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cabinet' element={<ProtectedRoute element={Cabinet} />} />
        <Route path='/catalog' element={<CatalogPage />} />
        <Route path='/category/:id' element={<CategoryPage />} />
        <Route path="/podcategorypage/:id" element={<PodcategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/oformlennya-zamovlennya" element={<OrderPage />} />
        <Route path="/zamovlennya_oformlene_uspishno" element={<ConfOrdPage />} />
        <Route path='/panel' element={<PanelPage />} />
        <Route path='/blog-tsikave-ta-korysne' element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPageTemplate />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/umovy-vykorustanay-saytu" element={<TermsOfUse />} />
        <Route path="/povernenya-tovary" element={<ProductReturn />} />
        <Route path="/polityka-konfidentsiynosti" element={<PrivacyPolicy />} />
      </Routes>
    </>
  );
}

export default App;