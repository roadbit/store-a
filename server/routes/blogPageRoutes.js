const express = require('express');
const multer = require('multer');
const path = require('path');
const blogPageController = require('../controllers/blogPageController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/blogpages', upload.array('images'), blogPageController.createBlogPage);
router.get('/blogpages', blogPageController.getAllBlogPages);
router.get('/blogpages/:id', blogPageController.getBlogPageById);
router.put('/blogpages/:id', upload.array('images'), blogPageController.updateBlogPage);
router.delete('/blogpages/:id', blogPageController.deleteBlogPage);

module.exports = router;