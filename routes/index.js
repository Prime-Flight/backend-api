require('dotenv').config();
const express = require('express');
const router = express.Router(); 
const controller = require('../controllers');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const apiDocument = YAML.load('./docs/api-docs.yaml');
const auth = require('./auth');
const middleware = require('../middlewares'); 
const access = require('../middlewares/access');
const name = require('../lib/enum');

// for the checker for hello world
router.get('/', controller.hello);
// for the Swagger API Documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocument));
// auth routes
router.use('/auth', auth);

// example on how to use the RBAC
// below is gonna be true
router.get('/access', middleware.restrict, access(name.modules.userDashboard, true, true), controller.hello);

// this cannot be accessed by user
router.get('/access-false', middleware.restrict, access(name.modules.userDashboard), controller.hello);


module.exports = router;
