const   express = require('express'),
        http = require('http'),
        bodyParser = require('body-parser'),
        consign = require('consign'),
        db = require('./bin/mongo'),
        jwtValidation = require('./bin/jwtValidation'),
        router = express.Router(),
        app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/../frontend'));
app.use('/api/', router);

app.routes = router;
app.validateToken = jwtValidation.validateToken;

db.connect(function (err) {
    if (err) {
        console.log(err.message);
        process.exit(1);
    }
});

consign({cwd: 'backend'}).include('controllers').then('routes').into(app);

// catch 404
app.use(function (req, res) {
    res.status(404).send({
        errorMessage: 'Page Not Found'
    });
});

var server = http.createServer(app);
app.set('port', process.env.PORT || '3000');

app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode.', app.get('port'), app.get('env'));
});