const express = require('express');
const router = express.Router();
const sliderRecCardController = require('../controllers/sliderRecCardController');

router.post('/', sliderRecCardController.createSliderCardRec);
router.get('/', sliderRecCardController.getSliderCardRec);
router.delete('/:id', sliderRecCardController.deleteSliderCardRec);

module.exports = router;