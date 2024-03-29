const express = require('express');
const app = express();
const controller = require('./controllers');
const router = require('./routes');
const morgan = require('morgan');
const methodOverride = require('method-override');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const { PORT, HOST } = process.env;
const cors = require('cors');
const bodyParser = require('body-parser');
const notificationActions = require('./lib/notification-actions'); 
const { User } = require('./db/models');
const path = require('path');

Sentry.init({
  dsn: "https://5e67869c400345c9ade926085aba0ecd@o4504071404126208.ingest.sentry.io/4504219923972096",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance

app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
app.use(express.json())
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.set('view-engine', 'ejs');
app.use(methodOverride('_method'));
app.use('/api', router);
app.get('/', controller.hello);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  // res.end(res.sentry + "\n");
  res.status(500).json({
    status: false,
    message: err
  });
});

const server = app.listen(PORT, console.log(`Running on port = ${PORT}`));

// create the socket
const io = require('socket.io')(server, {
  cors: {
    origin: HOST,
    methods: ["GET", "POST"]
  }
});

// set to io library into global
global.io = io

