const express = require('express');
const app = express();
const controller = require('./controllers');
const router = require('./routes');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { PORT } = process.env;

app.use(express.json())
app.use(morgan('dev'));
app.set('view-engine', 'ejs');
app.use(methodOverride('_method'));
app.use('/api', router);
app.get('/', controller.hello);

app.listen(PORT, console.log(`Running on port = ${PORT}`));

