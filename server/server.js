const bodyParser = require('body-parser');
const compression = require('compression');
const consign = require('consign');
const database = require('./middlewares/database');
const errorHandler = require('./middlewares/errorHandler');
const express = require('express');
const token = require('./middlewares/token');

const app = express();
database.connect();
app.routes = express.Router();
app.token = token;

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/../client`));
app.use('/api/', app.routes);

consign({ cwd: 'server' })
    .include('controllers')
    .then('routes')
    .into(app);

app.use(errorHandler);

app.use((req, res) => {
    res.status(404).end();
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Express server listening on port %d in %s mode.', port, app.get('env'));
});
