require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares');

router.post('/save', middleware.restrict, controller.passenger.save);
router.get('/get/', middleware.restrict, controller.passenger.get);
// router.get('/update', controller.passenger.update);
// router.get('/delete', controller.passenger.delete);

module.exports = router;
