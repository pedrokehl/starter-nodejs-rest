var bcrypt = require('bcryptjs'),
    jwt = require('../core/token'),
    userRepository = require('../repositories/user'),
    email = require('../core/email'),
    url = require('url');

module.exports = {
    checkReset: checkReset,
    forgot: forgot,
    login: login,
    register: register,
    reset: reset
};

function checkReset(req, res) {
    userRepository.findOne({username: req.params.username}).then(function(userFound) {
        if(!userFound) {
            return res.status(401).send({
                errorMessage: "Token not provided"
            });
        }
        jwt.validateToken(req, res, sendStatus, userFound.password);

        function sendStatus() {
            res.status(200).send();
        }
    });
}

function forgot(req, res) {
    var user = req.body;

    if(!user.email) {
        return res.status(400).send({
            errorMessage: "You must send the email"
        });
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
    });

    res.status(200).send({
        message: 'If you have entered a valid email, you will receive a link to recover your account in a few minutes'
    });
}

function login(req, res) {
    var user = req.body;

    if (!user.username || !user.password) {
        return res.status(400).send({
            errorMessage: "You must send the username and the password"
        });
    }

    userRepository.findOne({username: user.username}).then(function(userFound) {
        if (!userFound) {
            res.status(400).send({
                errorMessage: 'User not found'
            });
        }
        else if (bcrypt.compareSync(user.password, userFound.password)) {
            res.header('authorization', jwt.createToken({username: user.username}));
            res.status(200).send();
        }
        else {
            res.status(400).send({
                errorMessage: 'Invalid Password'
            });
        }
    });
}

function register(req, res) {
    var user = req.body;

    if (!user.username || !user.password) {
        return res.status(400).send({
            errorMessage: "You must send the username and the password"
        });
    }

    userRepository.findOne({username: user.username}).then(function(result) {
        if(result) {
            return res.status(400).send({
                errorMessage: 'A user with that username already exists'
            });
        }

        user.password = bcrypt.hashSync(user.password, 5);

        userRepository.insert(user).then(function() {
            res.header('authorization', jwt.createToken({username: user.username}));
            res.status(201).send();
        });
    });
}

function reset(req, res) {
    var user = {
        username: req.body.username,
        password: req.body.password
    };

    if (!user.username || !user.password) {
        return res.status(400).send({
            errorMessage: "You must send the username and the password"
        });
    }

    userRepository.findOne({username: user.username}).then(function(userFound) {
        if(!userFound) {
            return res.status(400).send({
                errorMessage: "You must send the username"
            });
        }
        jwt.validateToken(req, res, updateUserPassword, userFound.password);

        function updateUserPassword() {
            userFound.password = bcrypt.hashSync(user.password, 5);
            userRepository.update({username: userFound.username}, userFound).then(function () {
                res.status(200).send({
                    message: "Password changed."
                });
            }).catch(function () {
                return res.status(400).send({
                    errorMessage: "User not found"
                });
            })
        }
    });
}