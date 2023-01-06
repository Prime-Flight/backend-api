require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares')

router.get('/get', middleware.restrict,  controller.notification.getAllUserNotification);
router.put('/read', middleware.restrict,  controller.notification.readNotification);

module.exports = router;
