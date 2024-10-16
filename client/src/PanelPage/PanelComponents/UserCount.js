import React, { useContext } from 'react';
import { SocketContext } from '../../SocketContext';

const UserCount = () => {
  const { userCount } = useContext(SocketContext);

  return (
    <div className='online_user-item'>
      <h3><span className="online-dot"></span>Користувачів онлайн: {userCount}</h3>
    </div>
  );
};

export default UserCount;