const express = require('express');
const router = express.Router();
const catalogCardController = require('../controllers/catalogCardController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/catalogcards', catalogCardController.getCards);
router.post('/catalogcards', upload.single('image'), catalogCardController.createCard);
router.put('/catalogcards/:id', upload.single('image'), catalogCardController.updateCard);
router.put('/catalogcards/:id/category', catalogCardController.updateCardCategoryPage);
router.delete('/catalogcards/:id', catalogCardController.deleteCard);

module.exports = router;