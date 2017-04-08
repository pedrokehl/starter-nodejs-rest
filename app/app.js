const bodyParser = require('body-parser');
const compression = require('compression');
const consign = require('consign');
const express = require('express');
const database = require('./services/database');
const email = require('./services/email');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./services/logger');
const mainMiddleware = require('./middlewares/main');
const token = require('./middlewares/token');

// Init email server and db server
email.init();
database.connect();

// Init express
const app = express();
app.routes = express.Router();
app.token = token;
app.use(mainMiddleware.first);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', app.routes);

// Load all controller and routes
consign({ cwd: 'app/domains' })
  .include('controllers')
  .then('routes')
  .into(app);

app.use(errorHandler);
app.use(mainMiddleware.last);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Express server listening on port ${port} in ${app.get('env')} mode.`);
});

module.exports = app;
