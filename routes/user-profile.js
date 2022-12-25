require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const middleware = require('../middlewares');
const multer = require('multer');
const upload = multer();

router.get('/details', middleware.restrict, controller.userProfile.getUserDetails);
router.put('/update-details', middleware.restrict, controller.userProfile.updateUserDetails);
router.delete('/delete-details', controller.userProfile.deleteUserDetails);
router.post('/upload-profile', middleware.restrict, upload.single('media'), controller.userProfile.uploadProfilePicture);

module.exports = router;

