const express = require('express');
const app = express();
const router = require('./routes');
const { PORT } = process.env;

app.use(router);

app.listen(PORT, console.log(`Running on port = ${PORT}`));

