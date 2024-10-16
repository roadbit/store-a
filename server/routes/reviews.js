const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/', reviewController.getAllReviews);
router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.get('/count/:productId', reviewController.getReviewCountByProductId);
router.get('/all', reviewController.getAllReviewsFromAllProducts);
router.delete('/', reviewController.deleteReviews);

module.exports = router;