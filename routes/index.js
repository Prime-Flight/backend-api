require('dotenv').config();
const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const apiDocument = YAML.load('./docs/api-docs.yaml');
const auth = require('./auth');
const country = require('./country');
const flight = require('./flight');
const middleware = require('../middlewares');
const access = require('../middlewares/access');
const name = require('../lib/enum');
const airport = require('./airport');
const booking = require('./booking');
const user = require('./user-profile');
const userBooking = require('./user-booking');
const notification = require('./notification');

// for the checker for hello world
router.get('/', controller.hello);
// for the Swagger API Documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocument));
// auth routes
router.use('/auth', auth);
// country routes
router.use('/country', country);
// flight routes
router.use('/flight', flight);
// airport routes
router.use('/airport', airport);
// booking routes
router.use('/booking', booking);
// user profiles routes
router.use('/user', user);
// notification routes 
router.use('/notification', notification);
// user booking routes
router.use('/booking', userBooking);

// example on how to use the RBAC
// below is gonna be true
router.get('/access', middleware.restrict, access(name.modules.userDashboard, true, true), controller.hello);

// this cannot be accessed by user
router.get('/access-false', middleware.restrict, access(name.modules.userDashboard), controller.hello);


module.exports = router;
