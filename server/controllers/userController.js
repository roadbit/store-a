const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.updateUserInfo = async (req, res) => {
  const { firstName, lastName, phone, email, city, deliveryMethod, deliveryAddress, deliveryIndex, paymentMethod } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.city = city || user.city;
    user.deliveryMethod = deliveryMethod || user.deliveryMethod;
    user.deliveryAddress = deliveryAddress || user.deliveryAddress;
    user.deliveryIndex = deliveryIndex || user.deliveryIndex;
    user.paymentMethod = paymentMethod || user.paymentMethod;

    await user.save();
    res.json({ message: 'Інформація оновлена' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Поточний пароль невірний' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: 'Пароль успішно змінено' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ count: userCount });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};