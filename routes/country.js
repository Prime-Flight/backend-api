require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares')

router.get('/list', controller.country.getCountry);

module.exports = router;

