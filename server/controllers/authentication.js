var crypt = require('../middlewares/crypt'),
    email = require('../middlewares/email'),
    jwt = require('../middlewares/token'),
    userRepository = require('../repositories/user'),
    url = require('url');

module.exports = {
    checkReset: checkReset,
    forgot: forgot,
    login: login,
    register: register,
    reset: reset
};

function checkReset(req, res, next) {
    userRepository.findOne({username: req.params.username}).then(function(userFound) {
        if(!userFound) {
            next({status: 401, content: 'User not found'});
        }
        jwt.validateToken(req, userFound.password).then(function () {
            res.end();
        }).catch(next);
    }).catch(next);
}

function forgot(req, res, next) {
    var user = req.body;

    if(!user.email) {
        return next({status: 400, content: 'You must send the email'});
    }

    userRepository.findOne({email: user.email}).then(function(userFound) {
        if(!userFound) {
            return;
        }

        var token = jwt.createToken({username: userFound.username}, 86400, userFound.password);
        var recoveryUrl = url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: 'reset/' + userFound.username + '/' + token
        });
        
        var emailInfo = {
            from: '"Starter NODE.js REST" <starter.nodejs.rest@gmail.com>',
            to: user.email,
            subject: '[Starter] - Recover your password',
            html: '<a href="' + recoveryUrl + '" target="_blank">Click here to recover your account.</a>'
        };

        email(emailInfo);
    }).catch(next);

    res.end();
}

function login(req, res, next) {
    var user = req.body;

    if (!user.username || !user.password) {
        return next({status: 400, content: 'You must send the username and the password'});
    }

    userRepository.findOne({username: user.username}).then(function(userFound) {
        if (!userFound) {
            next({status: 401, content: 'User not found'});
        }
        crypt.compare(user.password, userFound.password).then(function() {
            res.header('authorization', jwt.createToken({username: user.username}));
            res.end();
        }).catch(next);
    }).catch(next);
}

function register(req, res, next) {
    var user = req.body;

    if (!user.username || !user.password) {
        return next({status: 400, content: 'You must send the username and the password'});
    }

    userRepository.findOne({username: user.username}).then(function(result) {
        if(result) {
            return next({status: 400, content: 'A user with that username already exists'});
        }

        crypt.hash(user.password).then(function(result) {
            user.password = result;
            userRepository.insert(user).then(function() {
                res.header('authorization', jwt.createToken({username: user.username}));
                res.status(201).end();
            }).catch(next);
        }).catch(next);
    }).catch(next);
}

function reset(req, res, next) {
    var user = {
        username: req.body.username,
        password: req.body.password
    };

    if (!user.username || !user.password) {
        return next({status: 400, content: 'You must send the username and the password'});
    }

    userRepository.findOne({username: user.username}).then(function(userFound) {
        if(!userFound) {
            return next({status: 400, content: 'You must send the username and the password'});
        }
        jwt.validateToken(req, userFound.password).then(function () {
            crypt.hash(user.password).then(function(result) {
                userFound.password = result;
                userRepository.update({username: userFound.username}, userFound).then(function () {
                    res.end();
                }).catch(next);
            }).catch(next);
        }).catch(next);
    }).catch(next);
}