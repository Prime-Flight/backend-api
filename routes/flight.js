require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares')

router.get('/get-flight', middleware.restrict, controller.flight.getFlightData);
// router.post('/create', middleware.restrict, controller.flight.create);
// router.delete('/delete', middleware.restrict, controller.flight.delete);

module.exports = router;

