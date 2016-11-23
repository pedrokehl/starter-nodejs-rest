var express = require('express'),
    bodyParser = require('body-parser'),
    consign = require('consign'),
    database = require('./middlewares/database'),
    errorHandler = require('./middlewares/errorHandler'),
    token = require('./middlewares/token'),
    app = express();

database.connect();
app.routes = express.Router();
app.token = token;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/../frontend'));
app.use('/api/', app.routes);

consign({cwd: 'server'})
    .include('controllers')
    .then('routes')
    .into(app);

app.use(function (req, res, next) {
    next({status: 404});
});

app.use(errorHandler);

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('Express server listening on port %d in %s mode.', port, app.get('env'));
});