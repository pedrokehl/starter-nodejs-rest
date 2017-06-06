const crypt = require('../services/crypt');
const email = require('../services/email');
const tokenService = require('../services/token');
const UserModel = require('../models/users');
const userValidation = require('../validations/user');
const url = require('url');

function checkReset(req, res, next) {
    UserModel.findOne({ username: req.params.username })
        .then(userValidation.validateToLogin)
        .then(userFound => tokenService.validateToken(req, userFound.password))
        .then(() => {
            res.setResponse('Ok to reset');
            next();
        })
        .catch(next);
}

function forgot(req, res, next) {
    const user = { email: req.body.email };

    if (!user.email) {
        next({ status: 400, content: 'You must send the email' });
        return;
    }

    res.setResponse('You will receive an e-mail with the instructions to recover you account');
    next();

    UserModel.findOne(user)
        .then(userValidation.validateToLogin)
        .then((userFound) => {
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
        })
        .catch(next);
}

function login(req, res, next) {
    const user = req.body;

    if (!user.username || !user.password) {
        next({ status: 400, content: 'You must send the username and the password' });
        return;
    }
    userValidation.validateRequired(user)
        .then(() => UserModel.findOne({ username: user.username }))
        .then(userValidation.validateToLogin)
        .then(userFound => crypt.compare(user.password, userFound.password))
        .then(() => {
            const userObj = { username: user.username };
            res.header('authorization', tokenService.createToken(userObj));
            res.setResponse(userObj);
            next();
        })
        .catch(next);
}

function register(req, res, next) {
    const user = req.body;

    UserModel(user).save()
        .then((userInserted) => {
            res.header('authorization', tokenService.createToken({ username: user.username }));
            user._id = userInserted._id;
            delete user.password;
            res.setResponse(user, 201);
            next();

            if (user.email) {
                const emailConfig = {
                    to: user.email,
                    subject: `[Starter] - Welcome ${user.username}`
                };

                email.sendMail(emailConfig, { name: user.username }, 'welcome.html');
            }
        })
        .catch(next);
}

function reset(req, res, next) {
    const user = req.body;

    userValidation.validateRequired(user)
        .then(() => UserModel.findOne({ username: user.username }))
        .then(userValidation.validateToLogin)
        .then(userFound => tokenService.validateToken(req, userFound.password))
        .then(() => crypt.hash(user.password))
        .then(hashResult => UserModel.updateOne({ username: user.username }, { password: hashResult }))
        .then(() => {
            res.setResponse({ username: user.username });
            next();
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
