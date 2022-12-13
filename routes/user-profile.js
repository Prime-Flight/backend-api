require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares');

router.get('/details', middleware.restrict, controller.userProfile.getUserDetails);
router.put('/update-details', middleware.restrict, controller.userProfile.updateUserDetails);
router.delete('/delete-details', controller.userProfile.deleteUserDetails);

module.exports = router;

