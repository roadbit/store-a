const express = require('express');
const router = express.Router();
const FooterLinks = require('../models/FooterLinks');

router.get('/', async (req, res) => {
  try {
    const links = await FooterLinks.findOne();
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { facebook, instagram, telegram, tiktok, viber, phone1, phone2 } = req.body;
    let links = await FooterLinks.findOne();
    if (links) {
      links.facebook = facebook;
      links.instagram = instagram;
      links.telegram = telegram;
      links.tiktok = tiktok;
      links.phone1 = phone1;
      links.phone2 = phone2;
      await links.save();
    } else {
      links = new FooterLinks({ facebook, instagram, telegram, tiktok, viber, phone1, phone2 });
      await links.save();
    }
    res.json({ message: 'Footer links updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;