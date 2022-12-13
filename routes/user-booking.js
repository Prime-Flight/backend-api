require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares');

router.post('/cancelBooking', middleware.restrict, controller.userBooking.cancelRequest);

module.exports = router;
