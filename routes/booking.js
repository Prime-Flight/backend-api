require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares');

router.get('/all', controller.booking.getAllBooking);
router.get('/details/:booking_id', controller.booking.getBookingDetails);
router.post('/accept', controller.booking.acceptUserBooking);
router.post('/reject', controller.booking.rejectUserBooking);

module.exports = router;
