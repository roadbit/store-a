const fs = require('fs');
const path = require('path');

const login = (req, res) => {
  const { login, password } = req.body;

  const dataPath = path.join(__dirname, '../data.json');
  const credentials = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  if (credentials.login === login && credentials.password === password) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Невірний логін або пароль' });
  }
};

module.exports = { login };