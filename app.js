const express = require('express');
const app = express();
const controller = require('./controllers');
const router = require('./routes');
const morgan = require('morgan');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const { PORT } = process.env;

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
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())
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
  res.end(res.sentry + "\n");
});

app.listen(PORT, console.log(`Running on port = ${PORT}`));

