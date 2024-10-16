const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');

router.get('/visits', visitController.getVisitsForLast24Hours);
router.post('/visits', visitController.recordVisit);

module.exports = router;