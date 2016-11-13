const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user');
const config = require('../config/default');
const bcrypt = require('bcrypt-nodejs');
const q = require('q');

module.exports = {
    login: login,
    register: register
};

function login(req, res) {
    var user = req.body;

    if (!user.username || !user.password) {
        return res.status(400).send("You must send the username and the password");
    }

    userRepository.findOne(user).then(function(userFound) {
        if (!userFound) {
            return res.status(400).send('User not found');
        }

        comparePassword(userFound, user.password).then(function(isMatch) {
            if(!isMatch) {
                return res.status(400).send('Invalid Password');
            }
            res.status(201).send({
                token: createToken(user),
                user: user.username
            });
        })
    });
}

function register(req, res) {
    var user = req.body;

    if (!user.username || !user.password) {
        return res.status(400).send("You must send the username and the password");
    }

    userRepository.findOne(user).then(function(result) {
        if(result) {
            return res.status(400).send('A user with that username already exists');
        }

        hashUserPassword(user)
        .then(userRepository.insert)
        .then(function() {
            res.status(201).send({
                token: createToken(user),
                user: user.username
            });
        })
    });
}

// Private methods
function comparePassword(user, password) {
    var deferred = q.defer();

    bcrypt.compare(password, user.password, function(err, isMatch) {
        if(err) deferred.reject(new Error(err));
        else deferred.resolve(isMatch);
    });

    return deferred.promise;
}

function createToken(user) {
    delete user.password;
    return jwt.sign(user, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

function hashUserPassword(user) {
    const SALT_FACTOR = 5;

    var deferred = q.defer();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if(err) deferred.reject(new Error(err));
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) deferred.reject(new Error(err));
            user.password = hash;
            deferred.resolve(user);
        });
    });

    return deferred.promise;
}