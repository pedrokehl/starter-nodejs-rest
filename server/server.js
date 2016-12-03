'use strict';
const   bodyParser = require('body-parser'),
        compression = require('compression'),
        consign = require('consign'),
        database = require('./middlewares/database'),
        errorHandler = require('./middlewares/errorHandler'),
        express = require('express'),
        token = require('./middlewares/token'),
        app = express();

database.connect();
app.routes = express.Router();
app.token = token;

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/../client'));
app.use('/api/', app.routes);

consign({cwd: 'server'})
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