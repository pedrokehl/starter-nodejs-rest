'use strict';
const   crypt = require('../middlewares/crypt'),
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
    userRepository.findOne({username: req.params.username}).then((userFound) => {
        if(!userFound) {
            next({status: 401, content: 'User not found'});
        }
        jwt.validateToken(req, userFound.password).then(() => {
            res.end();
        }).catch(next);
    }).catch(next);
}

function forgot(req, res, next) {
    let user = req.body;

    if(!user.email) {
        return next({status: 400, content: 'You must send the email'});
    }

    userRepository.findOne({email: user.email}).then((userFound) => {
        if(!userFound) {
            return;
        }

        const token = jwt.createToken({username: userFound.username}, 86400, userFound.password);

        const recoveryUrl = url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: 'reset/' + userFound.username + '/' + token
        });
        
        const emailInfo = {
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
    let user = req.body;

    if (!user.username || !user.password) {
        return next({status: 400, content: 'You must send the username and the password'});
    }

    userRepository.findOne({username: user.username}).then((userFound) => {
        if (!userFound) {
            return next({status: 401, content: 'User not found'});
        }
        crypt.compare(user.password, userFound.password).then(() => {
            res.header('authorization', jwt.createToken({username: user.username}));
            res.end();
        }).catch(next);
    }).catch(next);
}

function register(req, res, next) {
    let user = req.body;

    if (!user.username || !user.password) {
        return next({status: 400, content: 'You must send the username and the password'});
    }

    userRepository.findOne({username: user.username}).then((result) => {
        if(result) {
            return next({status: 400, content: 'A user with that username already exists'});
        }

        crypt.hash(user.password).then((result) => {
            user.password = result;
            userRepository.insert(user).then(() => {
                res.header('authorization', jwt.createToken({username: user.username}));
                res.status(201).end();
            }).catch(next);
        }).catch(next);
    }).catch(next);
}

function reset(req, res, next) {
    let user = {
        username: req.body.username,
        password: req.body.password
    };

    if (!user.username || !user.password) {
        return next({status: 400, content: 'You must send the username and the password'});
    }

    userRepository.findOne({username: user.username}).then((userFound) => {
        if(!userFound) {
            return next({status: 400, content: 'You must send the username and the password'});
        }
        jwt.validateToken(req, userFound.password).then(() => {
            crypt.hash(user.password).then((result) => {
                userFound.password = result;
                userRepository.update({username: userFound.username}, userFound).then(() => {
                    res.end();
                }).catch(next);
            }).catch(next);
        }).catch(next);
    }).catch(next);
}