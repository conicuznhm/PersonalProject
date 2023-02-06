const express = require('express');

const authController = require('../controllers/auth-controller')
const authenticate = require('../middlewares/authenticate')

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/user', authenticate, authController.getUser)

module.exports = router;
