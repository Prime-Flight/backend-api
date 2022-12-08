require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');


router.get('/search/:keyword', controller.airport.getAirport);

module.exports = router;

