const crypt = require('../services/crypt');
const email = require('../services/email');
const tokenService = require('../services/token');
const q = require('q');
const userRepository = require('../repositories/user');
const userValidation = require('../validations/user');
const url = require('url');

function checkReset(req, res, next) {
    userRepository.findByUsername(req.params.username)
        .then(userValidation.validateToLogin)
        .then(userFound => tokenService.validateToken(req, userFound.password))
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

        const token = tokenService.createToken({ username: userFound.username }, 86400, userFound.password);

        const recoveryUrl = url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: `reset/${userFound.username}/${token}`
        });

        const emailConfig = {
            to: user.email,
            subject: '[Starter] - Recover your password'
        };

        email.sendMail(emailConfig, { recoveryUrl }, 'email-reset.html');
    }).catch(next);

    res.end();
}

function login(req, res, next) {
    const user = {
        username: req.body.username,
        password: req.body.password
    };

    userValidation.validateRequired(user)
        .then(userRepository.findByUsername)
        .then(userValidation.validateToLogin)
        .then(userFound => crypt.compare(user.password, userFound.password))
        .then(() => {
            res.header('authorization', tokenService.createToken({ username: user.username }));
            res.end();
        })
        .catch(next);
}

function register(req, res, next) {
    const user = req.body;

    userValidation.validateRequired(user)
        .then(userRepository.findByUsername)
        .then(userValidation.validateToInsert)
        .then(() => crypt.hash(user.password))
        .then((hash) => {
            user.password = hash;
            return userRepository.insert(user);
        })
        .then(() => {
            res.header('authorization', tokenService.createToken({ username: user.username }));
            res.status(201).end();

            if (user.email) {
                const emailConfig = {
                    to: user.email,
                    subject: `[Starter] - Welcome ${user.username}`
                };

                const emailData = {
                    name: user.username
                };

                email.sendMail(emailConfig, emailData, 'welcome.html');
            }
        })
        .catch(next);
}

function reset(req, res, next) {
    const user = {
        username: req.body.username,
        password: req.body.password
    };

    userValidation.validateRequired(user)
        .then(userRepository.findByUsername)
        .then(userValidation.validateToLogin)
        .then(userFound => tokenService.validateToken(req, userFound.password))
        .then(() => crypt.hash(user.password))
        .then(hashResult => userRepository.update({ username: user.username }, { password: hashResult }))
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
    reset
};
