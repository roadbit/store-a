const express = require('express');
const router = express.Router();
const sliderIntCardController = require('../controllers/sliderIntCardController');

router.post('/', sliderIntCardController.createSliderCardInt);
router.get('/', sliderIntCardController.getSliderCardInt);
router.delete('/:id', sliderIntCardController.deleteSliderCardInt);

module.exports = router;