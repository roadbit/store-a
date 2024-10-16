import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const DeleteCheckboxes = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [filterGroupsBySubcategory, setFilterGroupsBySubcategory] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [checkboxes, setCheckboxes] = useState([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(`${baseURL}/podcategorypages`);
        setSubcategories(response.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };
    fetchSubcategories();
  }, []);

  useEffect(() => {
    const fetchFilterGroups = async () => {
      if (selectedSubcategory) {
        try {
          const response = await axios.get(`${baseURL}/api/filters/${selectedSubcategory}`);
          setFilterGroupsBySubcategory(response.data);
        } catch (error) {
          console.error('Error fetching filter groups:', error);
        }
      } else {
        setFilterGroupsBySubcategory([]);
      }
    };
    fetchFilterGroups();
  }, [selectedSubcategory]);

  useEffect(() => {
    const fetchCheckboxes = async () => {
      if (selectedGroup) {
        try {
          const response = await axios.get(`${baseURL}/api/checkboxes/${selectedGroup}`);
          setCheckboxes(response.data.checkboxes || []);
        } catch (error) {
          console.error('Error fetching checkboxes:', error);
          setCheckboxes([]);
        }
      } else {
        setCheckboxes([]);
      }
    };
    fetchCheckboxes();
  }, [selectedGroup]);

  const handleDeleteCheckbox = async () => {
    if (!selectedGroup || !selectedCheckbox) {
      setNotification('Оберіть чекбокс перед видаленням');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    try {
      await axios.delete(`${baseURL}/api/filters/${selectedGroup}/${selectedCheckbox}`);
      setCheckboxes(prev => prev.filter(c => c !== selectedCheckbox));
      setNotification('Чекбокс успішно видалено');
      setSelectedCheckbox('');
    } catch (error) {
      console.error('Error deleting checkbox:', error);
      setNotification('Помилка при видаленні чекбокса');
    }

    setTimeout(() => setNotification(''), 3000);
  };

  const handleDeleteFilterGroup = async () => {
    if (!selectedGroup) {
      setNotification('Оберіть групу перед видаленням');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    try {
      await axios.delete(`${baseURL}/api/filters/${selectedGroup}`);
      setFilterGroupsBySubcategory(prev => prev.filter(g => g._id !== selectedGroup));
      setNotification('Групу фільтрів успішно видалено');
      setSelectedGroup('');
      setCheckboxes([]);
    } catch (error) {
      console.error('Error deleting filter group:', error);
      setNotification('Помилка при видаленні групи фільтрів');
    }

    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className='create_container'>
      <h3 className='create_title'>Видалити групу фільтрів або фільтри</h3>
      <div className="delete_sect">
        <p className='block_title'>Підкатегорія</p>
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
        <p className='block_title'>Група фільтрів</p>
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} disabled={!selectedSubcategory}>
          <option value="">Оберіть групу фільтрів</option>
          {filterGroupsBySubcategory.map(group => (
            <option key={group._id} value={group._id}>{group.groupName}</option>
          ))}
        </select>
        <button className='dell' onClick={handleDeleteFilterGroup} disabled={!selectedGroup}>Видалити групу фільтрів</button>
        <p className='block_title'>Фільтр</p>
        <select value={selectedCheckbox} onChange={(e) => setSelectedCheckbox(e.target.value)} disabled={!selectedGroup}>
          <option value="">Оберіть фільтр</option>
          {checkboxes.map((checkbox, index) => (
            <option key={index} value={checkbox}>{checkbox}</option>
          ))}
        </select>

        <button className='dell' onClick={handleDeleteCheckbox} disabled={!selectedCheckbox}>Видалити фільтр</button>
      </div>

      {notification && (
        <div className='notification'>
          {notification}
        </div>
      )}
    </div>
  );
};

export default DeleteCheckboxes;