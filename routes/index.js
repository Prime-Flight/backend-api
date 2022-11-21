require('dotenv').config();
const express = require('express');
const router = express.Router(); 
const controller = require('../controllers');

router.get('/', controller.hello);

module.exports = router;
