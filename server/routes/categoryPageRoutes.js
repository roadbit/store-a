const express = require('express');
const router = express.Router();
const categoryPageController = require('../controllers/categoryPageController');

router.post('/categorypages', categoryPageController.createCategoryPage);
router.get('/categorypages/:id', categoryPageController.getCategoryPage);
router.get('/categorypages', categoryPageController.getAllCategoryPages);
router.delete('/categorypages/:id', categoryPageController.deleteCategoryPage);

module.exports = router;