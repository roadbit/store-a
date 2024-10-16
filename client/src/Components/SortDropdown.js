import React, { useState, useRef, useEffect } from 'react';

const sortOptions = [
  { value: 'lowToHigh', label: 'Від дешевих до дорогих' },
  { value: 'highToLow', label: 'Від дорогих до дешевих' },
  { value: 'topSales', label: 'Топ продажу' },
  { value: 'hitSales', label: 'Хіт продажу' },
  { value: 'newArrivals', label: 'Новинки' },
  { value: 'promotions', label: 'Акційні пропозиції' },
];

const SortDropdown = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const dropdownRef = useRef(null);

  const handleOptionClick = (value) => {
    setSelectedOption(value);
    onSortChange(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="sort-button">
        {selectedOption ? sortOptions.find(option => option.value === selectedOption).label : 'Сортувати'}
      </button>
      
      {isOpen && (
        <div className="sort-options">
          {sortOptions.map(option => (
            <div key={option.value} onClick={() => handleOptionClick(option.value)} className={`sort-option ${selectedOption === option.value ? 'active' : ''}`}>
              <p>{option.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;