import React, { useState, useEffect } from 'react';
import './cs.css'
import arrowUp from '../Assets/other-icon/up.svg';
import arrowDown from '../Assets/other-icon/down.svg';

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || options[0]);

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option);
  };

  return (
    <div className="custom-select">
      <div className="select-header" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption.label}
        <span className="arrow">
          <img
            src={isOpen ? arrowUp : arrowDown}
            alt="Arrow icon"
            className="arrow-icon"
          />
        </span>
      </div>
      {isOpen && (
        <div className="select-options">
          {options.map((option) => (
            <div
              key={option.value}
              className="select-option"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;