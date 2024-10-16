const fs = require('fs');
const path = require('path');

const updateCredentials = (req, res) => {
  const { login, password } = req.body;

  const dataPath = path.join(__dirname, '../data.json');
  const credentials = { login, password };

  fs.writeFile(dataPath, JSON.stringify(credentials, null, 2), (err) => {
    if (err) {
      console.error('Error writing to data.json:', err);
      return res.status(500).json({ success: false, message: 'Помилка при оновленні даних' });
    }
    return res.status(200).json({ success: true, message: 'Дані успішно оновлено' });
  });
};

module.exports = { updateCredentials };