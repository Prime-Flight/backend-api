require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares');

router.post('/cancelBooking', middleware.restrict, controller.userBooking.cancelRequest);

router.post('/order', middleware.restrict, controller.userBooking.order)
router.get('/myBooking', middleware.restrict, controller.userBooking.myBooking)
router.post('/cancel-order', middleware.restrict, controller.userBooking.cancelRequest)

module.exports = router;
