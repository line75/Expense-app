const express = require('express');
const AuthController = require('../controller/AuthController.js');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);

module.exports = router;