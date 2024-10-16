const express = require('express');
const router = express.Router();
const heroSlideController = require('../controllers/heroSlideController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

router.get('/', heroSlideController.getAllSlides);
router.post('/', upload.single('image'), heroSlideController.createSlide);
router.delete('/:id', heroSlideController.deleteSlide);

module.exports = router;