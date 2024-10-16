import React, { useEffect, useState } from 'react';
import axios from 'axios';

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const UserCountReg = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/user/count`);
        setUserCount(response.data.count);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className='online_user-item'>
      <h3><span className="online-dot"></span>Зареєстрованих користувачів: {userCount}</h3>
    </div>
  );
};

export default UserCountReg;