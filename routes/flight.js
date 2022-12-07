require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares')

router.get('/get-airport', middleware.restrict, controller.flight.getAirportData);
router.get('/get-flight', middleware.restrict, controller.flight.getFlightData);
router.post('/create', middleware.restrict, controller.flight.create);
router.put('/update', middleware.restrict, controller.flight.update);
router.delete('/delete', middleware.restrict, controller.flight.delete);

module.exports = router;

