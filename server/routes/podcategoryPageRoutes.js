const express = require('express');
const router = express.Router();
const podcategoryPageController = require('../controllers/podcategoryPageController');

router.get('/podcategorypages', podcategoryPageController.getAllPodcategoryPages);
router.post('/podcategorypages', podcategoryPageController.createPodcategoryPage);
router.get('/podcategorypages/:id', podcategoryPageController.getPodcategoryPage);
router.delete('/podcategorypages/:id', podcategoryPageController.deletePodcategoryPage);

module.exports = router;