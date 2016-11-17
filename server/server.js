var express = require('express'),
    bodyParser = require('body-parser'),
    consign = require('consign'),
    database = require('./core/database'),
    token = require('./core/token'),
    router = express.Router(),
    app = express();

database.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/../frontend'));
app.use('/api/', router);

app.routes = router;
app.token = token;

consign({cwd: 'server'}).include('controllers').then('routes').into(app);

// catch 404
app.use(function (req, res) {
    res.status(404).send({
        errorMessage: 'Page Not Found'
    });
});

var port = process.env.PORT || '3000';

app.listen(port, function() {
    console.log('Express server listening on port %d in %s mode.', port, app.get('env'));
});