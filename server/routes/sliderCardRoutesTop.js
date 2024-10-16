const express = require('express');
const router = express.Router();
const sliderCardControllerTop = require('../controllers/sliderCardTopController');

router.post('/', sliderCardControllerTop.createSliderCard);
router.get('/', sliderCardControllerTop.getSliderCards);
router.delete('/:id', sliderCardControllerTop.deleteSliderCard);

module.exports = router;