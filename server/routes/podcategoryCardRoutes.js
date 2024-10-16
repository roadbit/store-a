const express = require('express');
const router = express.Router();
const podcategoryCardController = require('../controllers/podcategoryCardController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/podcategorycards', podcategoryCardController.getAllPodcategoryCards);
router.post('/podcategorycards', upload.single('image'), podcategoryCardController.createPodcategoryCard);
router.get('/podcategorycards/:id', podcategoryCardController.getPodcategoryCard);
router.put('/podcategorycards/:id', upload.single('image'), podcategoryCardController.updatePodcategoryCard);
router.delete('/podcategorycards/:id', podcategoryCardController.deletePodcategoryCard);

module.exports = router;