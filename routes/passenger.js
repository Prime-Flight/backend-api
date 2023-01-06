require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares');

router.post('/save', middleware.restrict, controller.passenger.save);
router.get('/get', middleware.restrict, controller.passenger.get);
router.put('/update', middleware.restrict, controller.passenger.update);
// router.delete('/delete', middleware.restrict, controller.passenger.delete);
router.delete('/delete', controller.passenger.delete);

module.exports = router;
