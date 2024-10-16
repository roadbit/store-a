const express = require('express');
const { login } = require('../controllers/loginPanelController');
const { updateCredentials } = require('../controllers/updateCredentialsController');
const router = express.Router();

router.post('/login-panel', login);
router.put('/update-credentials', updateCredentials);

module.exports = router;