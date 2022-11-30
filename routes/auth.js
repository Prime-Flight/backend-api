require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares')

router.post('/register', controller.auth.register);
router.post('/login', controller.auth.login);
router.get('/login/google', controller.auth.google);
router.get('/whoami', controller.auth.google);
router.get('/forgot-password', controller.auth.viewForgotPassword);
router.post('/forgot-password', controller.auth.forgotPassword);
router.post('/reset-password', controller.auth.resetPassword);
router.get('/verify-user', controller.auth.verifyUser);
router.post('/verification-email', middleware.restrict, controller.auth.sendVerifyEmail);


module.exports = router;
