import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteImage from '../../../Assets/icon-nav/delete-icon.svg';
import PlusImage from '../../../Assets/panel-icon/plus-icon.svg';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const AddCheckboxes = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [filterGroupsBySubcategory, setFilterGroupsBySubcategory] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [newCheckboxes, setNewCheckboxes] = useState(['']);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCheckboxes, setNewGroupCheckboxes] = useState(['']);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(`${baseURL}/podcategorypages`);
        setSubcategories(response.data);
      } catch (error) {
        console.error('Error loading subcategories:', error);
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
      }
    };
    fetchFilterGroups();
  }, [selectedSubcategory]);

  const handleNewCheckboxChange = (index, value, type = 'existing') => {
    if (type === 'existing') {
      const updatedNewCheckboxes = [...newCheckboxes];
      updatedNewCheckboxes[index] = value;
      setNewCheckboxes(updatedNewCheckboxes);
    } else {
      const updatedNewGroupCheckboxes = [...newGroupCheckboxes];
      updatedNewGroupCheckboxes[index] = value;
      setNewGroupCheckboxes(updatedNewGroupCheckboxes);
    }
  };

  const addNewCheckbox = (type = 'existing') => {
    if (type === 'existing') {
      setNewCheckboxes((prev) => [...prev, '']);
    } else {
      setNewGroupCheckboxes((prev) => [...prev, '']);
    }
  };

  const removeCheckbox = (index, type = 'existing') => {
    if (type === 'existing') {
      const updatedNewCheckboxes = newCheckboxes.filter((_, i) => i !== index);
      setNewCheckboxes(updatedNewCheckboxes);
    } else {
      const updatedNewGroupCheckboxes = newGroupCheckboxes.filter((_, i) => i !== index);
      setNewGroupCheckboxes(updatedNewGroupCheckboxes);
    }
  };

  const handleAddNewCheckboxes = async () => {
    if (!selectedGroup || newCheckboxes.every((c) => !c.trim())) {
      setNotification('Оберіть групу фільтрів і заповніть нові фільтри');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    try {
      await axios.put(`${baseURL}/api/filters/${selectedGroup}`, { checkboxes: newCheckboxes });
      setNewCheckboxes(['']);
      setNotification('Фільтри успішно додані');
    } catch (error) {
      console.error('Error adding new checkboxes:', error);
      setNotification('Помилка при додаванні фільтрів');
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreateNewGroup = async () => {
    if (!newGroupName || newGroupCheckboxes.every((c) => !c.trim())) {
      setNotification('Заповніть назву групи і додайте хоча б один фільтр');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    try {
      const newGroup = {
        groupName: newGroupName,
        checkboxes: newGroupCheckboxes,
      };

      await axios.post(`${baseURL}/api/filters`, {
        subcategory: selectedSubcategory,
        filters: [newGroup],
      });

      setNewGroupName('');
      setNewGroupCheckboxes(['']);
      setNotification('Нова група успішно створена');
    } catch (error) {
      console.error('Error creating new filter group:', error);
      setNotification('Помилка при створенні нової групи');
    }
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="create_container">
      <h3 className="create_title">Додати нові фільтри до існуючих груп або створити нову групу</h3>
      
      <div className="select_filter">
        <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
          <option value="">Оберіть підкатегорію</option>
          {subcategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name || category.title}
            </option>
          ))}
        </select>

        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="">Оберіть групу фільтрів</option>
          {filterGroupsBySubcategory.map((group) => (
            <option key={group._id} value={group._id}>
              {group.groupName}
            </option>
          ))}
        </select>
      </div>
      
      {selectedGroup && (
        <div className="add-check">
          {newCheckboxes.map((checkbox, index) => (
            <div className="inner_add-check" key={index}>
              <input
                type="text"
                value={checkbox}
                onChange={(e) => handleNewCheckboxChange(index, e.target.value)}
                placeholder={`Новий фільтр ${index + 1}`}
              />
              {index === newCheckboxes.length - 1 && (
                <button className='plus_filter' onClick={() => addNewCheckbox()}><img src={PlusImage}/></button>
              )}
              <button className='delete_icon-btn' onClick={() => removeCheckbox(index)}><img src={DeleteImage}/></button>
            </div>
          ))}
          <button className='save_filter' onClick={handleAddNewCheckboxes}>Зберегти зміни</button>
        </div>
      )}

      <div className="new_filter">
        <h3 className="create_title">Створити нову групу фільтрів</h3>
        <input
          className='new_group'
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Назва нової групи"
        />

        <div className="add-check">
          {newGroupCheckboxes.map((checkbox, index) => (
            <div className="add_check" key={index}>
              <input
                type="text"
                value={checkbox}
                onChange={(e) => handleNewCheckboxChange(index, e.target.value, 'newGroup')}
                placeholder={`Новий фільтр ${index + 1}`}
              />
              {index === newGroupCheckboxes.length - 1 && (
                <button className='plus_filter' onClick={() => addNewCheckbox('newGroup')}><img src={PlusImage}/></button>
              )}
              <button className='delete_icon-btn' onClick={() => removeCheckbox(index, 'newGroup')}><img src={DeleteImage}/></button>
            </div>
          ))}
          <button className='save_filter' onClick={handleCreateNewGroup}>Створити нову групу</button>
        </div>
      </div>

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
};

export default AddCheckboxes;