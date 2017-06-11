const bodyParser = require('body-parser');
const compression = require('compression');
const consign = require('consign');
const database = require('./services/database');
const email = require('./services/email');
const errorHandler = require('./middlewares/error-handler');
const express = require('express');
const logger = require('./services/logger');
const mainMiddleware = require('./middlewares/main');
const token = require('./middlewares/token');
const config = require('./config');

const app = express();

email.init();
database.connect();
app.routes = express.Router();
app.token = token;

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(mainMiddleware.first);
app.use(express.static(`${__dirname}/../client`));
app.use('/api/', app.routes);

consign({ cwd: 'server' })
    .include('controllers')
    .then('routes')
    .into(app);

app.use(errorHandler);
app.use(mainMiddleware.last);

app.listen(config.port, () => logger.info(`Server listening on port ${config.port} in ${app.get('env')} mode.`));
