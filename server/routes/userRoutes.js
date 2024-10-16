const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { changePassword, updateUserInfo, getUserCount } = require('../controllers/userController');
const User = require('../models/User');

router.get('/api/user/order-info', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    const orderInfo = {
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      city: user.city,
      deliveryMethod: user.deliveryMethod,
      deliveryAddress: user.deliveryAddress,
    };

    res.json(orderInfo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/api/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.put('/api/user/update', authMiddleware, async (req, res) => {
  const { firstName, lastName, phone, email, city, deliveryMethod, deliveryAddress, deliveryIndex, paymentMethod, departmentNumber } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
    user.departmentNumber = departmentNumber || user.departmentNumber;

    await user.save();

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.put('/api/user/change-password', authMiddleware, changePassword);
router.put('/api/user/update', authMiddleware, updateUserInfo);

router.get('/api/user/count', getUserCount);

module.exports = router;