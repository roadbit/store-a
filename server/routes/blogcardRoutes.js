const express = require('express');
const multer = require('multer');
const { createBlogCard, updateBlogCard, deleteBlogCard, getBlogCards } = require('../controllers/blogCardController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.get('/', getBlogCards);
router.post('/', upload.array('images', 1), createBlogCard);
router.put('/:id', upload.array('images', 1), updateBlogCard);
router.delete('/:id', deleteBlogCard);

module.exports = router;