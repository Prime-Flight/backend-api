require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares')

router.get('/list', controller.country.getCountry);
router.get('/phone-code', controller.country.getPhoneCode);

module.exports = router;

