require('dotenv').config();
const express = require('express');
const router = express.Router(); 
const controller = require('../controllers');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const apiDocument = YAML.load('./docs/api-docs.yaml');
const auth = require('./auth');

// for the checker for hello world
router.get('/', controller.hello);
// for the Swagger API Documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocument));
// auth routes
router.use('/auth', auth);

module.exports = router;
