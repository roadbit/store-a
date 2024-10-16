import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteImage from '../../../Assets/icon-nav/delete-icon.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const CheckboxManager = () => {
  const [filterGroups, setFilterGroups] = useState([{ groupName: '', checkboxes: [''] }]);
  const [subcategories, setSubcategories] = useState([]);
  const [filterGroupsBySubcategory, setFilterGroupsBySubcategory] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    axios.get(`${baseURL}/podcategorypages`)
      .then(response => setSubcategories(response.data))
      .catch(error => console.error('Error loading subcategories:', error));
  }, []);

  useEffect(() => {
    if (selectedSubcategory) {
      axios.get(`${baseURL}/api/filters/${selectedSubcategory}`)
        .then(response => setFilterGroupsBySubcategory(response.data))
        .catch(error => console.error('Error fetching filter groups:', error));
    }
  }, [selectedSubcategory]);

  const handleGroupNameChange = (index, value) => {
    const newFilterGroups = [...filterGroups];
    newFilterGroups[index].groupName = value;
    setFilterGroups(newFilterGroups);
  };

  const handleCheckboxChange = (groupIndex, checkboxIndex, value) => {
    const newFilterGroups = [...filterGroups];
    newFilterGroups[groupIndex].checkboxes[checkboxIndex] = value;
    setFilterGroups(newFilterGroups);
  };

  const addCheckbox = (e, groupIndex) => {
    e.preventDefault();
    const newFilterGroups = [...filterGroups];
    newFilterGroups[groupIndex].checkboxes.push('');
    setFilterGroups(newFilterGroups);
  }

  const addFilterGroup = (e) => {
    e.preventDefault();
    setFilterGroups([...filterGroups, { groupName: '', checkboxes: [''] }]);
  };

  const removeCheckbox = (groupIndex, checkboxIndex) => {
    const newFilterGroups = [...filterGroups];
    newFilterGroups[groupIndex].checkboxes.splice(checkboxIndex, 1);
    setFilterGroups(newFilterGroups);
  };

  const removeFilterGroup = (groupIndex) => {
    const newFilterGroups = [...filterGroups];
    newFilterGroups.splice(groupIndex, 1);
    setFilterGroups(newFilterGroups);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubcategory) {
      setNotification('Оберіть підкатегорію перед збереженням');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    try {
      await axios.post(`${baseURL}/api/filters`, { subcategory: selectedSubcategory, filters: filterGroups });
      setFilterGroups([{ groupName: '', checkboxes: [''] }]);
      setNotification('Фільтри успішно збережені');
    } catch (error) {
      console.error('Error saving filters:', error);
      setNotification('Помилка при збереженні фільтрів');
    }

    setTimeout(() => setNotification(''), 3000);
  }

  return (
    <div className='create_container'>
      <h3 className='create_title'>Створити фільтри</h3>
      <form className="form">
        <select 
          value={selectedSubcategory} 
          onChange={(e) => {
            setSelectedSubcategory(e.target.value);
          }}>
          <option value="">Оберіть підкатегорію</option>
          {subcategories.map(category => (
            <option key={category._id} value={category._id}>{category.name || category.title}</option>
          ))}
        </select>
        
        {filterGroups.map((group, groupIndex) => (
          <div key={groupIndex} className='create_filter-item'>
            <p>Назва групи</p>
            <div className="group_filter-item">
              <input
                type="text"
                value={group.groupName}
                onChange={(e) => handleGroupNameChange(groupIndex, e.target.value)}
                placeholder="Наприклад 'Бренд'"
              />
              <button type="button" className='delete_icon-btn' onClick={() => removeFilterGroup(groupIndex)}><img src={DeleteImage}/></button>
            </div>
            
            <div className="check_item-col">
              <p>Назва фільтру</p>
              <div className="check_item-col__input">
                {group.checkboxes.map((checkbox, checkboxIndex) => (
                  <div key={checkboxIndex} className="checkbox-with-delete">
                    <input
                      type="text"
                      value={checkbox}
                      onChange={(e) => handleCheckboxChange(groupIndex, checkboxIndex, e.target.value)}
                      placeholder={`Наприклад "Apple" ${checkboxIndex + 1}`}
                    />
                    <button type="button" className='delete_icon-btn' onClick={() => removeCheckbox(groupIndex, checkboxIndex)}><img src={DeleteImage}/></button>
                  </div>
                ))}
                <button type="button" className='plus_icon-btn' onClick={(e) => addCheckbox(e, groupIndex)}>Додати фільтр</button>
              </div>
            </div>
          </div>
        ))}
        <div className="item_add-save__btn">
          <button type="button" onClick={addFilterGroup}>Додати групу</button>
          <button onClick={handleSubmit}>Зберегти фільтри</button>
        </div>

      </form>
  
      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}
    </div>
  );
};

export default CheckboxManager;