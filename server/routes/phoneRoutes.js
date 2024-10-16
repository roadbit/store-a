const express = require('express');
const router = express.Router();
const PhoneNumber = require('../models/PhoneNumber');

router.get('/', async (req, res) => {
  try {
    const phone = await PhoneNumber.findOne();
    res.json(phone);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { number } = req.body;
    let phone = await PhoneNumber.findOne();
    if (phone) {
      phone.number = number;
      await phone.save();
    } else {
      phone = new PhoneNumber({ number });
      await phone.save();
    }
    res.json({ message: 'Phone number updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;