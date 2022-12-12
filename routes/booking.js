require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares');

router.get('/all', controller.booking.getAllBooking);
router.post('/approve', controller.booking.approveUserBooking);
router.post('/reject', controller.booking.rejectUserBooking)

module.exports = router;
