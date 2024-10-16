import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteIcon from '../../Assets/icon-nav/delete-icon.svg';
import './cabinet.css'
const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, []);

  const handleCheckboxChange = (id) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [id]: !prevCheckedItems[id]
    }));
  };

  const deleteCheckedItems = () => {
    const newWishlist = wishlist.filter(item => !checkedItems[item.id]);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setCheckedItems({});
  };

  const isAnyChecked = Object.values(checkedItems).some(isChecked => isChecked);

  return (
    <div className='wish_tab-info'>
      <h2>Обране</h2>
      {isAnyChecked && (
        <button onClick={deleteCheckedItems} className="delete_wish-btn">
          <img src={DeleteIcon} alt="Видалити" />
          Видалити відмічені
        </button>
      )}
      <div className="grid_wish-container">
        {wishlist.length > 0 ? (
          wishlist.map((item, index) => (
            <div key={index} className="wish_card">
              <input
                type="checkbox"
                checked={checkedItems[item.id] || false}
                onChange={() => handleCheckboxChange(item.id)}
              />
              <Link to={item.url}>
                <img className='wish_image-card' src={`${baseURL}/${item.image}`} alt={item.name} />
                <p className="wish_title-text__card">{item.name}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>Список обраного пустий :(</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;