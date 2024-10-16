import React, { useState } from 'react';
const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const UpdateCredentials = () => {
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/api/update-credentials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: newLogin, password: newPassword }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage('Логін та пароль успішно оновлено!');
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error updating credentials:', error);
      setMessage('Сталася помилка. Спробуйте ще раз.');
    }
  };

  return (
    <div className="update-credentials-container">
      <h2>Оновлення логіну та паролю</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Новий логін"
          value={newLogin}
          onChange={(e) => setNewLogin(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Новий пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Оновити</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateCredentials;