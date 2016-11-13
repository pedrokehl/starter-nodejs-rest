const   userRepository = require('../repositories/user'),
        bcrypt = require('bcrypt-nodejs'),
        q = require('q'),
        jwtValidation = require('../bin/jwtValidation');

module.exports = {
    login: login,
    register: register
};

function login(req, res) {
    var user = req.body;

    if (!user.username || !user.password) {
        return res.status(400).send({
            errorMessage: "You must send the username and the password"
        });
    }

    userRepository.findOne(user).then(function(userFound) {
        if (!userFound) {
            return res.status(400).send({
                errorMessage: 'User not found'
            });
        }

        comparePassword(userFound, user.password).then(function(isMatch) {
            if(!isMatch) {
                return res.status(400).send({
                    errorMessage: 'Invalid Password'
                });
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
        return res.status(400).send({
            errorMessage: "You must send the username and the password"
        });
    }

    userRepository.findOne(user).then(function(result) {
        if(result) {
            return res.status(400).send({
                errorMessage: 'A user with that username already exists'
            });
        }

        hashUserPassword(user)
        .then(userRepository.insert)
        .then(function() {
            res.status(201).send({
                token: jwtValidation.createToken(user.username)
            });
        })
        .catch(function(err) {
            res.status(400).send({
                errorMessage: 'error -' + err
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

function hashUserPassword(user) {
    const SALT_FACTOR = 5;

    var deferred = q.defer();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) {
                deferred.reject(new Error(err));
            }
            else {
                user.password = hash;
                deferred.resolve(user);
            }
        });
    });

    return deferred.promise;
}