import React, { useEffect, useState } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const FilterProcessor = ({ selectedFilters, onFilteredCards }) => {
  const [filteredCards, setFilteredCards] = useState([]);

  useEffect(() => {
    const fetchFilteredCards = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/products`);
        const productPages = response.data;

        const matchingProductPages = productPages.filter(page => {
          return Object.entries(selectedFilters).every(([group, selectedCheckboxes]) => {
            return selectedCheckboxes.some(checkbox =>
              page.characteristics[group]?.includes(checkbox)
            );
          });
        });

        const matchingCards = await Promise.all(
          matchingProductPages.map(async page => {
            if (page._id) {
              try {
                const cardResponse = await axios.get(`${baseURL}/api/cards/${page._id}`);
                return cardResponse.data;
              } catch (error) {
                console.error('Error fetching card:', error);
                return null;
              }
            } else {
              console.warn('product._id is undefined for page:', page);
              return null;
            }
          })
        );

        const validCards = matchingCards.filter(card => card !== null);

        setFilteredCards(validCards);
        onFilteredCards(validCards);
      } catch (error) {
        console.error('Error filtering cards:', error);
      }
    };

    fetchFilteredCards();
  }, [selectedFilters, onFilteredCards]);

  return null;
};

export default FilterProcessor;