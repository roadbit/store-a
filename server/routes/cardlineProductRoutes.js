const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createCardlineProduct, getCardlineProducts, updateCardlineProduct, deleteCardlineProduct } = require('../controllers/cardlineProductController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), createCardlineProduct);
router.get('/', getCardlineProducts);
router.patch('/:id', upload.single('image'), updateCardlineProduct);
router.delete('/:id', deleteCardlineProduct);

module.exports = router;