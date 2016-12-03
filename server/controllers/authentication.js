const crypt = require('../middlewares/crypt');
const email = require('../middlewares/email');
const jwt = require('../middlewares/token');
const userRepository = require('../repositories/user');
const url = require('url');

function checkReset(req, res, next) {
    userRepository.findOne({ username: req.params.username }).then((userFound) => {
        if (!userFound) {
            next({ status: 401, content: 'User not found' });
        }
        jwt.validateToken(req, userFound.password).then(() => {
            res.end();
        }).catch(next);
    }).catch(next);
}

function forgot(req, res, next) {
    const user = req.body;

    if (!user.email) {
        next({ status: 400, content: 'You must send the email' });
        return;
    }

    userRepository.findOne({ email: user.email }).then((userFound) => {
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
    const user = req.body;

    if (!user.username || !user.password) {
        next({ status: 400, content: 'You must send the username and the password' });
        return;
    }

    userRepository.findOne({ username: user.username }).then((userFound) => {
        if (!userFound) {
            next({ status: 401, content: 'User not found' });
            return;
        }
        crypt.compare(user.password, userFound.password).then(() => {
            res.header('authorization', jwt.createToken({ username: user.username }));
            res.end();
        }).catch(next);
    }).catch(next);
}

function register(req, res, next) {
    const user = req.body;

    if (!user.username || !user.password) {
        next({ status: 400, content: 'You must send the username and the password' });
        return;
    }

    userRepository.findOne({ username: user.username }).then((dbResult) => {
        if (dbResult) {
            next({ status: 400, content: 'A user with that username already exists' });
            return;
        }

        crypt.hash(user.password).then((hashResult) => {
            user.password = hashResult;
            userRepository.insert(user).then(() => {
                res.header('authorization', jwt.createToken({ username: user.username }));
                res.status(201).end();
            }).catch(next);
        }).catch(next);
    }).catch(next);
}

function reset(req, res, next) {
    const user = {
        username: req.body.username,
        password: req.body.password,
    };

    if (!user.username || !user.password) {
        next({ status: 400, content: 'You must send the username and the password' });
        return;
    }

    userRepository.findOne({ username: user.username }).then((userFound) => {
        if (!userFound) {
            next({ status: 400, content: 'You must send the username and the password' });
            return;
        }
        jwt.validateToken(req, userFound.password).then(() => {
            crypt.hash(user.password).then((result) => {
                userFound.password = result;
                userRepository.update({ username: userFound.username }, userFound).then(() => {
                    res.end();
                }).catch(next);
            }).catch(next);
        }).catch(next);
    }).catch(next);
}

module.exports = {
    checkReset,
    forgot,
    login,
    register,
    reset,
};
