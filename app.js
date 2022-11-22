const express = require('express');
const app = express();
const router = require('./routes');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { PORT } = process.env;

app.use(morgan('dev'));
app.set('view-engine', 'ejs');
app.use(methodOverride('_method'));
app.use('/api', router);

app.listen(PORT, console.log(`Running on port = ${PORT}`));

