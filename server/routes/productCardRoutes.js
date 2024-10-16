const express = require('express');
const router = express.Router();
const productCardController = require('../controllers/productCardController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/productcards', upload.single('image'), productCardController.createProductCard);
router.get('/productcards', productCardController.getProductCardsByPodcategoryPage);

router.get('/all-productcards', productCardController.getAllProductCards);
router.get('/search-productcards', productCardController.searchProductCards);

module.exports = router;