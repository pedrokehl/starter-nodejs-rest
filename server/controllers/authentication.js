const crypt = require('../middlewares/crypt');
const email = require('../middlewares/email');
const jwt = require('../middlewares/token');
const q = require('q');
const userRepository = require('../repositories/user');
const userValidation = require('../validations/user');
const url = require('url');

function checkReset(req, res, next) {
    const user = {
        username: req.params.username
    };

    function validateToken(userFound) {
        return jwt.validateToken(req, userFound.password);
    }

    userRepository.findOne(user)
        .then(userValidation.validateToLogin)
        .then(validateToken)
        .then(() => {
            res.end();
        })
        .catch(next);
}

function forgot(req, res, next) {
    const user = {
        email: req.body.email
    };

    if (!user.email) {
        next({ status: 400, content: 'You must send the email' });
        return;
    }

    userRepository.findOne(user).then((userFound) => {
        if (!userFound) {
            return;
        }

        const token = jwt.createToken({ username: userFound.username }, 86400, userFound.password);

        const recoveryUrl = url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: `reset/${userFound.username}/${token}`,
        });

        const emailInfo = {
            from: '"Starter NODE.js REST" <starter.nodejs.rest@gmail.com>',
            to: user.email,
            subject: '[Starter] - Recover your password',
            html: `<a href="${recoveryUrl}" target="_blank">Click here to recover your account.</a>`,
        };

        email(emailInfo);
    }).catch(next);

    res.end();
}

function login(req, res, next) {
    const user = {
        username: req.body.username,
        password: req.body.password,
    };

    function comparePassword(userFound) {
        return crypt.compare(user.password, userFound.password);
    }

    userValidation.validateRequired(user)
        .then(userRepository.findOne)
        .then(userValidation.validateToLogin)
        .then(comparePassword)
        .then(() => {
            res.header('authorization', jwt.createToken({ username: user.username }));
            res.end();
        })
        .catch(next);
}

function register(req, res, next) {
    const user = req.body;

    function hashPassword() {
        return crypt.hash(user.password);
    }

    function setHashedPassword(hash) {
        user.password = hash;
        return q.resolve(user);
    }

    userValidation.validateRequired(user)
        .then(userRepository.findOne)
        .then(userValidation.validateToInsert)
        .then(hashPassword)
        .then(setHashedPassword)
        .then(userRepository.insert)
        .then(() => {
            res.header('authorization', jwt.createToken({ username: user.username }));
            res.status(201).end();
        })
        .catch(next);
}

function reset(req, res, next) {
    const user = {
        username: req.body.username,
        password: req.body.password,
    };

    function validateToken(userFound) {
        return jwt.validateToken(req, userFound.password);
    }

    function hashPassword() {
        return crypt.hash(user.password);
    }

    function updateUser(hashResult) {
        return userRepository.update({ username: user.username }, { password: hashResult });
    }

    userValidation.validateRequired(user)
        .then(userRepository.findOne)
        .then(userValidation.validateToLogin)
        .then(validateToken)
        .then(hashPassword)
        .then(updateUser)
        .then(() => {
            res.end();
        })
        .catch(next);
}

module.exports = {
    checkReset,
    forgot,
    login,
    register,
    reset,
};
