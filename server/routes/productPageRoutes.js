const express = require('express');
const router = express.Router();
const productPageController = require('../controllers/productPageController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ message: 'Помилка завантаження файлів', error: err });
    }
    next();
  });
}, productPageController.createProductPage);

router.post('/', upload.array('images', 10), productPageController.createProductPage);
router.get('/', productPageController.getAllProductPages);
router.get('/:id', productPageController.getProductPageById);
router.put('/:id', upload.array('images', 10), productPageController.updateProductPage);
router.delete('/:id', productPageController.deleteProductPage)

module.exports = router;